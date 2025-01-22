// src/components/GestionDeDepots.tsx

import React, { useEffect, useState } from 'react';
import { 
    Button, 
    IconButton, 
    Modal, 
    Box, 
    TextField, 
    Typography, 
    Select, 
    MenuItem, 
    InputLabel, 
    FormControl, 
    Checkbox, 
    ListItemText, 
    OutlinedInput 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateIcon from '@mui/icons-material/Update';
import axios from 'axios';
import { SelectChangeEvent } from '@mui/material/Select';

interface Game {
    game_id: number;
    name: string;
    publisher: string;
}

interface Deposit {
    deposit_id?: number; // Optionnel car généré par le backend
    seller_id: number;
    buyer_id: number;
    date: string; // Format ISO, ex: "2025-01-22"
    quantity: number;
    games: number[]; // Liste des game_id inclus dans le dépôt
}

interface Seller {
    seller_id: number;
    name: string;
}

interface Buyer {
    buyer_id: number;
    name: string;
}

const GestionDeDepots: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [depots, setDepots] = useState<Deposit[]>([]);
    const [sellers, setSellers] = useState<Seller[]>([]);
    const [buyers, setBuyers] = useState<Buyer[]>([]);
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [newDeposit, setNewDeposit] = useState<Deposit>({
        seller_id: 0,
        buyer_id: 0,
        date: '',
        quantity: 1,
        games: []
    });
    const [selectedDeposit, setSelectedDeposit] = useState<Deposit | null>(null); // Pour la mise à jour

    // Ouvre la modale d'ajout
    const handleOpen = () => {
        setNewDeposit({
            seller_id: 0,
            buyer_id: 0,
            date: '',
            quantity: 1,
            games: []
        });
        setOpen(true);
    };

    // Ferme la modale d'ajout
    const handleClose = () => {
        setOpen(false);
    };

    // Ouvre la modale de mise à jour
    const handleOpenUpdate = (deposit: Deposit) => {
        setSelectedDeposit(deposit);
        setNewDeposit({
            seller_id: deposit.seller_id,
            buyer_id: deposit.buyer_id,
            date: deposit.date,
            quantity: deposit.quantity,
            games: deposit.games
        });
        setOpenUpdate(true);
    };

    // Ferme la modale de mise à jour
    const handleCloseUpdate = () => {
        setOpenUpdate(false);
        setSelectedDeposit(null);
    };

    // Gère les changements dans les champs de formulaire
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<number>,
        child?: React.ReactNode
    ) => {
        const name = e.target.name as keyof Deposit;
        let value: any = e.target.value;

        // Convertir en nombre si nécessaire
        if (name === 'seller_id' || name === 'buyer_id' || name === 'quantity') {
            value = Number(value);
        }

        setNewDeposit({
            ...newDeposit,
            [name]: value
        });
    };

    // Gère les changements dans le champ de sélection des jeux
    const handleGamesChange = (event: SelectChangeEvent<number[]>) => {
        const { value } = event.target;
        setNewDeposit({
            ...newDeposit,
            games: typeof value === 'string' ? value.split(',').map(Number) : value as number[]
        });
    };

    // Soumet le formulaire pour ajouter un dépôt
    const handleSubmitAdd = async () => {
        const { seller_id, buyer_id, date, quantity, games } = newDeposit;

        // Validation des champs
        if (!seller_id || !buyer_id || !date || quantity < 1 || games.length === 0) {
            setError('Veuillez remplir tous les champs obligatoires et sélectionner au moins un jeu.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/api/deposits/deposits', {
                seller_id,
                buyer_id,
                date,
                quantity,
                games
            });

            setDepots([...depots, response.data]);
            setNewDeposit({
                seller_id: 0,
                buyer_id: 0,
                date: '',
                quantity: 1,
                games: []
            });
            setError(null);
            handleClose();
        } catch (err: any) {
            console.error('Erreur lors de l\'ajout du dépôt:', err);
            setError(err.response?.data?.error || 'Échec de l\'ajout du dépôt.');
        }
    };

    // Soumet le formulaire pour mettre à jour un dépôt
    const handleSubmitUpdate = async () => {
        if (!selectedDeposit) return;

        const { seller_id, buyer_id, date, quantity, games } = newDeposit;

        // Validation des champs
        if (!seller_id || !buyer_id || !date || quantity < 1 || games.length === 0) {
            setError('Veuillez remplir tous les champs obligatoires et sélectionner au moins un jeu.');
            return;
        }

        try {
            const response = await axios.put(`http://localhost:3000/api/deposits/deposits/${selectedDeposit.deposit_id}`, {
                seller_id,
                buyer_id,
                date,
                quantity,
                games
            });

            setDepots(depots.map(depot => depot.deposit_id === selectedDeposit.deposit_id ? response.data : depot));
            setNewDeposit({
                seller_id: 0,
                buyer_id: 0,
                date: '',
                quantity: 1,
                games: []
            });
            setSelectedDeposit(null);
            setError(null);
            handleCloseUpdate();
        } catch (err: any) {
            console.error('Erreur lors de la mise à jour du dépôt:', err);
            setError(err.response?.data?.error || 'Échec de la mise à jour du dépôt.');
        }
    };

    // Supprime un dépôt
    const deleteDeposit = async (deposit_id: number) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce dépôt ?')) return;

        try {
            await axios.delete(`http://localhost:3000/api/deposits/deposits/${deposit_id}`);
            setDepots(depots.filter(depot => depot.deposit_id !== deposit_id));
            setError(null);
        } catch (err: any) {
            console.error('Erreur lors de la suppression du dépôt:', err);
            setError(err.response?.data?.error || 'Échec de la suppression du dépôt.');
        }
    };

    // Récupère les données nécessaires depuis le backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [depotsRes, sellersRes, buyersRes, gamesRes] = await Promise.all([
                    axios.get('http://localhost:3000/api/deposits/deposits'),
                    axios.get('http://localhost:3000/api/sellers/sellers'),
                    axios.get('http://localhost:3000/api/buyers/buyers'),
                    axios.get('http://localhost:3000/api/games/games')
                ]);

                setDepots(depotsRes.data);
                setSellers(sellersRes.data);
                setBuyers(buyersRes.data);
                setGames(gamesRes.data);
            } catch (err) {
                console.error('Erreur lors de la récupération des données:', err);
                setError('Échec de la récupération des données.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="text-center mt-10">Chargement...</div>;
    }

    return (
        <div className="flex flex-col items-center space-y-4 p-4">
            <h1 className="text-3xl font-bold mb-4">Gestion des Dépôts</h1>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
                Ajouter un Dépôt
            </Button>
            {error && <div className="text-center mt-2 text-red-500">{error}</div>}
            <ul className="space-y-4 w-full max-w-4xl">
                {depots.map((depot: Deposit) => (
                    <li key={depot.deposit_id} className="border p-4 rounded shadow-md">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold">Dépôt #{depot.deposit_id}</h2>
                            <div className="flex space-x-2">
                                <IconButton aria-label="update" size="small" onClick={() => handleOpenUpdate(depot)}>
                                    <UpdateIcon />
                                </IconButton>
                                <IconButton aria-label="delete" size="small" onClick={() => deleteDeposit(depot.deposit_id!)}>
                                    <DeleteIcon />
                                </IconButton>
                            </div>
                        </div>
                        <p><strong>Vendeur:</strong> {sellers.find(s => s.seller_id === depot.seller_id)?.name || 'N/A'}</p>
                        <p><strong>Acheteur:</strong> {buyers.find(b => b.buyer_id === depot.buyer_id)?.name || 'N/A'}</p>
                        <p><strong>Date:</strong> {new Date(depot.date).toLocaleDateString()}</p>
                        <p><strong>Quantité:</strong> {depot.quantity}</p>
                        <p><strong>Jeux:</strong> {games.filter(g => depot.games.includes(g.game_id)).map(g => g.name).join(', ')}</p>
                    </li>
                ))}
            </ul>

            {/* Modal pour ajouter un dépôt */}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="add-deposit-modal"
                aria-describedby="modal-to-add-deposit"
            >
                <Box
                    className="bg-white p-6 rounded-lg w-full max-w-md mx-auto mt-20 shadow-lg"
                    sx={{
                        position: 'absolute' as 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        alignItems: 'center'
                    }}
                >
                    <Typography variant="h6" id="add-deposit-modal">
                        Ajouter un nouveau Dépôt
                    </Typography>

                    <FormControl fullWidth variant="outlined" className="mb-4">
                        <InputLabel id="seller-label">Vendeur</InputLabel>
                        <Select
                            labelId="seller-label"
                            label="Vendeur"
                            name="seller_id"
                            value={newDeposit.seller_id}
                            onChange={handleInputChange} // Maintenant compatible
                        >
                            {sellers.map(seller => (
                                <MenuItem key={seller.seller_id} value={seller.seller_id}>
                                    {seller.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth variant="outlined" className="mb-4">
                        <InputLabel id="buyer-label">Acheteur</InputLabel>
                        <Select
                            labelId="buyer-label"
                            label="Acheteur"
                            name="buyer_id"
                            value={newDeposit.buyer_id}
                            onChange={handleInputChange} // Maintenant compatible
                        >
                            {buyers.map(buyer => (
                                <MenuItem key={buyer.buyer_id} value={buyer.buyer_id}>
                                    {buyer.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        label="Date"
                        type="date"
                        variant="outlined"
                        fullWidth
                        name="date"
                        value={newDeposit.date}
                        onChange={handleInputChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        className="mb-4"
                    />

                    <TextField
                        label="Quantité"
                        type="number"
                        variant="outlined"
                        fullWidth
                        name="quantity"
                        value={newDeposit.quantity}
                        onChange={handleInputChange}
                        InputProps={{ inputProps: { min: 1 } }}
                        className="mb-4"
                    />

                    <FormControl fullWidth variant="outlined" className="mb-4">
                        <InputLabel id="games-label">Jeux</InputLabel>
                        <Select
                            labelId="games-label"
                            label="Jeux"
                            multiple
                            name="games"
                            value={newDeposit.games}
                            onChange={handleGamesChange} // Gestion séparée
                            input={<OutlinedInput label="Jeux" />}
                            renderValue={(selected) => (selected as number[]).map(id => games.find(g => g.game_id === id)?.name).join(', ')}
                        >
                            {games.map(game => (
                                <MenuItem key={game.game_id} value={game.game_id}>
                                    <Checkbox checked={newDeposit.games.indexOf(game.game_id) > -1} />
                                    <ListItemText primary={game.name} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <div className="flex gap-4 w-full">
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={handleClose}
                            className="flex-1"
                        >
                            Annuler
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmitAdd}
                            className="flex-1"
                        >
                            Ajouter
                        </Button>
                    </div>
                </Box>
            </Modal>

            {/* Modal pour mettre à jour un dépôt */}
            <Modal
                open={openUpdate}
                onClose={handleCloseUpdate}
                aria-labelledby="update-deposit-modal"
                aria-describedby="modal-to-update-deposit"
            >
                <Box
                    className="bg-white p-6 rounded-lg w-full max-w-md mx-auto mt-20 shadow-lg"
                    sx={{
                        position: 'absolute' as 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        alignItems: 'center'
                    }}
                >
                    <Typography variant="h6" id="update-deposit-modal">
                        Modifier le Dépôt
                    </Typography>

                    <FormControl fullWidth variant="outlined" className="mb-4">
                        <InputLabel id="seller-update-label">Vendeur</InputLabel>
                        <Select
                            labelId="seller-update-label"
                            label="Vendeur"
                            name="seller_id"
                            value={newDeposit.seller_id}
                            onChange={handleInputChange} // Maintenant compatible
                        >
                            {sellers.map(seller => (
                                <MenuItem key={seller.seller_id} value={seller.seller_id}>
                                    {seller.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth variant="outlined" className="mb-4">
                        <InputLabel id="buyer-update-label">Acheteur</InputLabel>
                        <Select
                            labelId="buyer-update-label"
                            label="Acheteur"
                            name="buyer_id"
                            value={newDeposit.buyer_id}
                            onChange={handleInputChange} // Maintenant compatible
                        >
                            {buyers.map(buyer => (
                                <MenuItem key={buyer.buyer_id} value={buyer.buyer_id}>
                                    {buyer.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        label="Date"
                        type="date"
                        variant="outlined"
                        fullWidth
                        name="date"
                        value={newDeposit.date}
                        onChange={handleInputChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        className="mb-4"
                    />

                    <TextField
                        label="Quantité"
                        type="number"
                        variant="outlined"
                        fullWidth
                        name="quantity"
                        value={newDeposit.quantity}
                        onChange={handleInputChange}
                        InputProps={{ inputProps: { min: 1 } }}
                        className="mb-4"
                    />

                    <FormControl fullWidth variant="outlined" className="mb-4">
                        <InputLabel id="games-update-label">Jeux</InputLabel>
                        <Select
                            labelId="games-update-label"
                            label="Jeux"
                            multiple
                            name="games"
                            value={newDeposit.games}
                            onChange={handleGamesChange} // Gestion séparée
                            input={<OutlinedInput label="Jeux" />}
                            renderValue={(selected) => (selected as number[]).map(id => games.find(g => g.game_id === id)?.name).join(', ')}
                        >
                            {games.map(game => (
                                <MenuItem key={game.game_id} value={game.game_id}>
                                    <Checkbox checked={newDeposit.games.indexOf(game.game_id) > -1} />
                                    <ListItemText primary={game.name} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <div className="flex gap-4 w-full">
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={handleCloseUpdate}
                            className="flex-1"
                        >
                            Annuler
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmitUpdate}
                            className="flex-1"
                        >
                            Modifier
                        </Button>
                    </div>
                </Box>
            </Modal>
        </div>
    );

};

export default GestionDeDepots;