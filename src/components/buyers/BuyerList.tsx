import React, { useEffect, useState } from 'react';
import { Button, IconButton, Modal, Box, TextField, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateIcon from '@mui/icons-material/Update';
import axios from 'axios';

interface Buyer {
    buyer_id?: number; // Optionnel car généré par le backend
    name: string;
    email: string;
    phone: string;
    address: string;
}

const BuyerList: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [buyers, setBuyers] = useState<Buyer[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [newBuyer, setNewBuyer] = useState<Buyer>({
        name: '',
        email: '',
        phone: '',
        address: ''
    });
    const [selectedBuyer, setSelectedBuyer] = useState<Buyer | null>(null); // Pour la mise à jour

    // Ouvre la modale d'ajout
    const handleOpen = () => {
        setNewBuyer({
            name: '',
            email: '',
            phone: '',
            address: ''
        });
        setOpen(true);
    };

    // Ferme la modale d'ajout
    const handleClose = () => {
        setOpen(false);
    };

    // Ouvre la modale de mise à jour
    const handleOpenUpdate = (buyer: Buyer) => {
        setSelectedBuyer(buyer);
        setNewBuyer({
            name: buyer.name,
            email: buyer.email,
            phone: buyer.phone,
            address: buyer.address || ''
        });
        setOpenUpdate(true);
    };

    // Ferme la modale de mise à jour
    const handleCloseUpdate = () => {
        setOpenUpdate(false);
        setSelectedBuyer(null);
    };

    // Gère les changements dans les champs de formulaire
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewBuyer({
            ...newBuyer,
            [name]: value
        });
    };

    // Soumet le formulaire pour ajouter un buyer
    const handleSubmitAdd = async () => {
        const { name, email, phone, address } = newBuyer;

        // Validation des champs
        if (!name.trim() || !email.trim() || !phone.trim() || !address.trim()) {
            setError('Veuillez remplir tous les champs obligatoires.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/api/buyers', {
                name: name.trim(),
                email: email.trim(),
                phone: phone.trim(),
                address: address.trim()
            });

            setBuyers([...buyers, response.data]);
            setNewBuyer({ name: '', email: '', phone: '', address: '' });
            setError(null);
            handleClose();
        } catch (err: any) {
            console.error('Erreur lors de l\'ajout du buyer:', err);
            setError(err.response?.data?.error || 'Échec de l\'ajout du buyer.');
        }
    };

    // Soumet le formulaire pour mettre à jour un buyer
    const handleSubmitUpdate = async () => {
        if (!selectedBuyer) return;

        const { name, email, phone, address } = newBuyer;

        // Validation des champs
        if (!name.trim() || !email.trim() || !phone.trim() || !address.trim()) {
            setError('Veuillez remplir tous les champs obligatoires.');
            return;
        }

        try {
            const response = await axios.put(`http://localhost:3000/api/buyers/${selectedBuyer.buyer_id}`, {
                name: name.trim(),
                email: email.trim(),
                phone: phone.trim(),
                address: address.trim()
            });

            setBuyers(buyers.map(buyer => buyer.buyer_id === selectedBuyer.buyer_id ? response.data : buyer));
            setNewBuyer({ name: '', email: '', phone: '', address: '' });
            setSelectedBuyer(null);
            setError(null);
            handleCloseUpdate();
        } catch (err: any) {
            console.error('Erreur lors de la mise à jour du buyer:', err);
            setError(err.response?.data?.error || 'Échec de la mise à jour du buyer.');
        }
    };

    // Supprime un buyer
    const deleteBuyer = async (buyer_id: number) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce buyer ?')) return;

        try {
            await axios.delete(`http://localhost:3000/api/buyers/${buyer_id}`);
            setBuyers(buyers.filter((buyer) => buyer.buyer_id !== buyer_id));
            setError(null);
        } catch (err: any) {
            console.error('Erreur lors de la suppression du buyer:', err);
            setError(err.response?.data?.error || 'Échec de la suppression du buyer.');
        }
    };

    // Récupère les buyers depuis le backend
    useEffect(() => {
        const fetchBuyers = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/buyers');
                setBuyers(response.data);
            } catch (err) {
                console.error('Erreur lors de la récupération des buyers:', err);
                setError('Échec de la récupération des buyers.');
            } finally {
                setLoading(false);
            }
        };

        fetchBuyers();
    }, []);

    if (loading) {
        return <div className="text-center mt-10">Chargement...</div>;
    }

    return (
        <div className="flex flex-col items-center space-y-4">
            <h1 className="text-3xl font-bold mb-4">Liste des Acheteurs</h1>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
                Ajouter un Acheteur
            </Button>
            {error && <div className="text-center mt-2 text-red-500">{error}</div>}
            <ul className="space-y-4 w-full max-w-md">
                {buyers.map((buyer: Buyer) => (
                    <li key={buyer.buyer_id} className="border p-4 rounded shadow-md w-full max-w-md">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold">{buyer.name}</h2>
                            <div className="flex space-x-2">
                                <IconButton onClick={() => handleOpenUpdate(buyer)}>
                                    <UpdateIcon className="text-blue-500" />
                                </IconButton>
                                <IconButton onClick={() => deleteBuyer(buyer.buyer_id!)}>
                                    <DeleteIcon className="text-red-500"/>
                                </IconButton>
                            </div>
                        </div>
                        <p>Email: {buyer.email}</p>
                        <p>Téléphone: {buyer.phone}</p>
                        <p>Addresse: {buyer.address}</p>
                    </li>
                ))}
            </ul>

            {/* Modal pour ajouter un buyer */}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="add-buyer-modal"
                aria-describedby="modal-to-add-buyer"
            >
                <Box
                    className="bg-white p-6 rounded-lg w-full max-w-md mx-auto mt-20 shadow-lg"
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        alignItems: 'center'
                    }}
                >
                    <Typography variant="h6" id="add-buyer-modal">
                        Ajouter un nouvelle Acheteur
                    </Typography>

                    <TextField
                        label="Nom"
                        variant="outlined"
                        fullWidth
                        name="name"
                        value={newBuyer.name}
                        onChange={handleInputChange}
                        className="mb-4"
                    />

                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        name="email"
                        value={newBuyer.email}
                        onChange={handleInputChange}
                        className="mb-4"
                    />

                    <TextField
                        label="Phone"
                        variant="outlined"
                        fullWidth
                        name="phone"
                        value={newBuyer.phone}
                        onChange={handleInputChange}
                        className="mb-4"
                    />

                    <TextField
                        label="Address"
                        variant="outlined"
                        fullWidth
                        name="address"
                        value={newBuyer.address}
                        onChange={handleInputChange}
                        className="mb-4"
                    />

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

            {/* Modal pour mettre à jour un buyer */}
            <Modal
                open={openUpdate}
                onClose={handleCloseUpdate}
                aria-labelledby="update-buyer-modal"
                aria-describedby="modal-to-update-buyer"
            >
                <Box
                    className="bg-white p-6 rounded-lg w-full max-w-md mx-auto mt-20 shadow-lg"
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        alignItems: 'center'
                    }}
                >
                    <Typography variant="h6" id="update-buyer-modal">
                        Mettre à Jour le Buyer
                    </Typography>

                    <TextField
                        label="Nom"
                        variant="outlined"
                        fullWidth
                        name="name"
                        value={newBuyer.name}
                        onChange={handleInputChange}
                        className="mb-4"
                    />

                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        name="email"
                        value={newBuyer.email}
                        onChange={handleInputChange}
                        className="mb-4"
                    />

                    <TextField
                        label="Phone"
                        variant="outlined"
                        fullWidth
                        name="phone"
                        value={newBuyer.phone}
                        onChange={handleInputChange}
                        className="mb-4"
                    />

                    <TextField
                        label="Address"
                        variant="outlined"
                        fullWidth
                        name="address"
                        value={newBuyer.address}
                        onChange={handleInputChange}
                        className="mb-4"
                    />

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
                            Mettre à Jour
                        </Button>
                    </div>
                </Box>
            </Modal>
        </div>
    );

};

export default BuyerList;