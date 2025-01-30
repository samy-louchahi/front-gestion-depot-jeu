// src/components/deposits/AddDepositModal.tsx

import React, { useState, useEffect } from 'react';
import {
    Modal,
    Box,
    TextField,
    Typography,
    Button,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Checkbox,
    ListItemText,
    OutlinedInput,
    IconButton,
    Grid,
    SelectChangeEvent,
} from '@mui/material';
import { RemoveCircleOutline } from '@mui/icons-material';
import { Deposit, Seller, Session, Game, Stock } from '../../types';
import { createDeposit, getActiveSessions, getSellers, getGames } from '../../services/depositService';
import { createOrUpdateStock } from '../../services/stockService';

interface AddDepositModalProps {
    open: boolean;
    onClose: () => void;
    onAdd: (deposit: Deposit) => void;
}

const AddDepositModal: React.FC<AddDepositModalProps> = ({ open, onClose, onAdd }) => {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [sellers, setSellers] = useState<Seller[]>([]);
    const [games, setGames] = useState<Game[]>([]);
    const [selectedSession, setSelectedSession] = useState<number | string>('');
    const [selectedSeller, setSelectedSeller] = useState<number | string>('');
    const [selectedGames, setSelectedGames] = useState<number[]>([]);
    const [gameDetails, setGameDetails] = useState<Record<number, { price: number; fees: number; quantity: number }>>({});
    const [depositDate, setDepositDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [discountFees, setDiscountFees] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (open) {
            // Fetch active sessions, sellers, and games
            const fetchData = async () => {
                try {
                    const [sessionsData, sellersData, gamesData] = await Promise.all([
                        getActiveSessions(),
                        getSellers(),
                        getGames(),
                    ]);
                    setSessions(sessionsData);
                    setSellers(sellersData);
                    setGames(gamesData);
                } catch (err) {
                    console.error('Error fetching data:', err);
                    setError('Erreur lors de la récupération des données.');
                }
            };
            fetchData();
        }
    }, [open]);

    const handleSessionChange = (event: SelectChangeEvent<string | number>) => {
        setSelectedSession(event.target.value as number);
    };

    const handleSellerChange = (event: SelectChangeEvent<string | number>) => {
        setSelectedSeller(event.target.value as number);
    };

    const handleGameSelectChange = (event: SelectChangeEvent<number[]>) => {
        const value = event.target.value as number[];
        setSelectedGames(value);

        // Ajouter des détails pour les nouveaux jeux sélectionnés
        const newGameDetails: Record<number, { price: number; fees: number; quantity: number }> = { ...gameDetails };
        value.forEach((game_id) => {
            if (!newGameDetails[game_id]) {
                newGameDetails[game_id] = { price: 0, fees: 0, quantity: 1 };
            }
        });

        // Supprimer les détails des jeux qui ne sont plus sélectionnés
        Object.keys(newGameDetails).forEach((key) => {
            if (!value.includes(Number(key))) {
                delete newGameDetails[Number(key)];
            }
        });

        setGameDetails(newGameDetails);
    };

    const handleGameDetailChange = (
        game_id: number,
        field: keyof { price: number; fees: number; quantity: number },
        value: number
    ) => {
        setGameDetails((prev) => ({
            ...prev,
            [game_id]: {
                ...prev[game_id],
                [field]: value,
            },
        }));
    };

    const handleSubmit = async () => {
        // Validation
        if (!selectedSession || !selectedSeller || selectedGames.length === 0) {
            setError('Veuillez sélectionner une session, un vendeur et au moins un jeu.');
            return;
        }

        // Préparer les données du DepositGame
        const depositData = {
            seller_id: Number(selectedSeller),
            session_id: Number(selectedSession),
            deposit_date: depositDate,
            discount_fees: discountFees,
            games: selectedGames.map((game_id) => ({
                game_id,
                price: gameDetails[game_id].price,
                fees: gameDetails[game_id].fees,
                quantity: gameDetails[game_id].quantity,
            })),
        };

        try {
            // 1. Créer le DepositGame
            const newDeposit = await createDeposit(depositData);

            // 2. Créer les Stocks associés
            const stockPromises = depositData.games.map((game) => {
                return createOrUpdateStock({
                    session_id: depositData.session_id,
                    seller_id: depositData.seller_id,
                    game_id: game.game_id,
                    initial_quantity: game.quantity,
                    current_quantity: game.quantity,
                });
            });

            // Attendre que tous les Stocks soient créés
            const stocks = await Promise.all(stockPromises);

            // 3. Mettre à jour l'interface utilisateur
            onAdd(newDeposit);
            
            // 4. Réinitialiser le formulaire
            setSelectedSession('');
            setSelectedSeller('');
            setSelectedGames([]);
            setGameDetails({});
            setDepositDate(new Date().toISOString().split('T')[0]);
            setDiscountFees(0);
            setError(null);
            onClose();
        } catch (err: any) {
            console.error('Erreur lors de la création du dépôt ou des stocks:', err);
            if (err.response && err.response.status === 404) {
                setError('Endpoint de création des stocks non trouvé. Veuillez vérifier la configuration du backend.');
            } else {
                setError('Échec de la création du dépôt ou des stocks.');
            }
        }
    };

    const handleCloseModal = () => {
        // Réinitialiser le formulaire lors de la fermeture
        setSelectedSession('');
        setSelectedSeller('');
        setSelectedGames([]);
        setGameDetails({});
        setDepositDate(new Date().toISOString().split('T')[0]);
        setDiscountFees(0);
        setError(null);
        onClose();
    };

    return (
        <Modal open={open} onClose={handleCloseModal}>
            <Box
                className="bg-white p-6 rounded-lg w-full max-w-2xl mx-auto mt-10 overflow-auto shadow-lg"
                sx={{
                    position: 'absolute' as 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    maxHeight: '90vh',
                    width: '90%',
                }}
            >
                <Typography variant="h5" className="text-center mb-4">
                    Créer un Dépôt
                </Typography>
                {error && (
                    <Typography color="error" className="mb-2 text-center">
                        {error}
                    </Typography>
                )}
                <FormControl fullWidth variant="outlined" className="mb-4">
                    <InputLabel id="session-label">Session Active</InputLabel>
                    <Select
                        labelId="session-label"
                        label="Session Active"
                        value={selectedSession}
                        onChange={handleSessionChange}
                    >
                        {sessions
                            .filter((session) => session.status)
                            .map((session) => (
                                <MenuItem key={session.session_id} value={session.session_id}>
                                    {session.name} ({new Date(session.start_date).toLocaleDateString()} -{' '}
                                    {new Date(session.end_date).toLocaleDateString()})
                                </MenuItem>
                            ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth variant="outlined" className="mb-4">
                    <InputLabel id="seller-label">Vendeur</InputLabel>
                    <Select
                        labelId="seller-label"
                        label="Vendeur"
                        value={selectedSeller}
                        onChange={handleSellerChange}
                    >
                        {sellers.map((seller) => (
                            <MenuItem key={seller.seller_id} value={seller.seller_id}>
                                {seller.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth variant="outlined" className="mb-4">
                    <InputLabel id="game-label">Jeux à Déposer</InputLabel>
                    <Select
                        labelId="game-label"
                        label="Jeux à Déposer"
                        multiple
                        value={selectedGames}
                        onChange={handleGameSelectChange}
                        input={<OutlinedInput label="Jeux à Déposer" />}
                        renderValue={(selected) => {
                            const selectedNames = games
                                .filter((game) => selected.includes(game.game_id))
                                .map((game) => game.name);
                            return selectedNames.join(', ');
                        }}
                    >
                        {games.map((game) => (
                            <MenuItem key={game.game_id} value={game.game_id}>
                                <Checkbox checked={selectedGames.indexOf(game.game_id) > -1} />
                                <ListItemText primary={game.name} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Afficher les détails des jeux sélectionnés */}
                {selectedGames.map((game_id) => {
                    const game = games.find((g) => g.game_id === game_id);
                    const details = gameDetails[game_id];
                    return (
                        <Box key={game_id} className="mb-4 p-2 border rounded">
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle1">{game?.name || 'Jeu Inconnu'}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={2}>
                                    <TextField
                                        label="Prix (€)"
                                        type="number"
                                        variant="outlined"
                                        fullWidth
                                        value={details.price}
                                        onChange={(e) =>
                                            handleGameDetailChange(game_id, 'price', parseFloat(e.target.value))
                                        }
                                        inputProps={{ step: '0.01' }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={2}>
                                    <TextField
                                        label="Quantité"
                                        type="number"
                                        variant="outlined"
                                        fullWidth
                                        value={details.quantity}
                                        onChange={(e) =>
                                            handleGameDetailChange(game_id, 'quantity', parseInt(e.target.value))
                                        }
                                        inputProps={{ min: '1' }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12}>
                                    <IconButton
                                        color="secondary"
                                        onClick={() => {
                                            setSelectedGames((prev) => prev.filter((id) => id !== game_id));
                                            setGameDetails((prev) => {
                                                const newDetails = { ...prev };
                                                delete newDetails[game_id];
                                                return newDetails;
                                            });
                                        }}
                                    >
                                        <RemoveCircleOutline />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Box>
                    );
                })}

                <Box className="mb-4">
                    <TextField
                        label="Date de Dépôt"
                        type="date"
                        variant="outlined"
                        fullWidth
                        className="mb-4"
                        value={depositDate}
                        onChange={(e) => setDepositDate(e.target.value)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        label="Réduction sur les Frais (%)"
                        type="number"
                        variant="outlined"
                        fullWidth
                        className="mb-4"
                        value={discountFees}
                        onChange={(e) => setDiscountFees(parseFloat(e.target.value))}
                        inputProps={{ step: '0.01', min: '0', max: '100' }}
                    />
                </Box>

                <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>
                    Ajouter le Dépôt
                </Button>
            </Box>
        </Modal>
    );
};
    export default AddDepositModal;
