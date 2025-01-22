import React, { useEffect, useState } from 'react';
import { Button, IconButton, Modal, Box, TextField, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateIcon from '@mui/icons-material/Update';
import axios from 'axios';

interface Seller {
    seller_id?: number; // Optionnel car généré par le backend
    name: string;
    email: string;
    phone: string;
    address?: string; // Ajouté si nécessaire
}

const SellerList: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [sellers, setSellers] = useState<Seller[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [newSeller, setNewSeller] = useState<Seller>({
        name: '',
        email: '',
        phone: '',
        address: ''
    });
    const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null); // Pour la mise à jour

    // Ouvre la modale d'ajout
    const handleOpen = () => {
        setNewSeller({
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
    const handleOpenUpdate = (seller: Seller) => {
        setSelectedSeller(seller);
        setNewSeller({
            name: seller.name,
            email: seller.email,
            phone: seller.phone,
            address: seller.address || ''
        });
        setOpenUpdate(true);
    };

    // Ferme la modale de mise à jour
    const handleCloseUpdate = () => {
        setOpenUpdate(false);
        setSelectedSeller(null);
    };

    // Gère les changements dans les champs de formulaire
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewSeller({
            ...newSeller,
            [name]: value
        });
    };

    // Soumet le formulaire pour ajouter un seller
    const handleSubmitAdd = async () => {
        const { name, email, phone, address } = newSeller;

        // Validation des champs
        if (!name.trim() || !email.trim() || !phone.trim()) {
            setError('Veuillez remplir tous les champs obligatoires.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/api/sellers', {
                name: name.trim(),
                email: email.trim(),
                phone: phone.trim(),
                address: address?.trim()
            });

            setSellers([...sellers, response.data]);
            setNewSeller({ name: '', email: '', phone: '', address: '' });
            setError(null);
            handleClose();
        } catch (err: any) {
            console.error('Erreur lors de l\'ajout du seller:', err);
            setError(err.response?.data?.error || 'Échec de l\'ajout du seller.');
        }
    };

    // Soumet le formulaire pour mettre à jour un seller
    const handleSubmitUpdate = async () => {
        if (!selectedSeller) return;

        const { name, email, phone, address } = newSeller;

        // Validation des champs
        if (!name.trim() || !email.trim() || !phone.trim()) {
            setError('Veuillez remplir tous les champs obligatoires.');
            return;
        }

        try {
            const response = await axios.put(`http://localhost:3000/api/sellers/${selectedSeller.seller_id}`, {
                name: name.trim(),
                email: email.trim(),
                phone: phone.trim(),
                address: address?.trim()
            });

            setSellers(sellers.map(seller => seller.seller_id === selectedSeller.seller_id ? response.data : seller));
            setNewSeller({ name: '', email: '', phone: '', address: '' });
            setSelectedSeller(null);
            setError(null);
            handleCloseUpdate();
        } catch (err: any) {
            console.error('Erreur lors de la mise à jour du seller:', err);
            setError(err.response?.data?.error || 'Échec de la mise à jour du seller.');
        }
    };

    // Supprime un seller
    const deleteSeller = async (seller_id: number) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce seller ?')) return;

        try {
            await axios.delete(`http://localhost:3000/api/sellers/${seller_id}`);
            setSellers(sellers.filter((seller) => seller.seller_id !== seller_id));
            setError(null);
        } catch (err: any) {
            console.error('Erreur lors de la suppression du seller:', err);
            setError(err.response?.data?.error || 'Échec de la suppression du seller.');
        }
    };

    // Récupère les sellers depuis le backend
    useEffect(() => {
        const fetchSellers = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/sellers');
                setSellers(response.data);
            } catch (err) {
                console.error('Erreur lors de la récupération des sellers:', err);
                setError('Échec de la récupération des sellers.');
            } finally {
                setLoading(false);
            }
        };

        fetchSellers();
    }, []);

    if (loading) {
        return <div className="text-center mt-10">Chargement...</div>;
    }

    return (
        <div className="flex flex-col items-center space-y-4">
            <h1 className="text-3xl font-bold mb-4">Liste des Sellers</h1>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
                Ajouter un Seller
            </Button>
            {error && <div className="text-center mt-2 text-red-500">{error}</div>}
            <ul className="space-y-4 w-full max-w-md">
                {sellers.map((seller: Seller) => (
                    <li key={seller.seller_id} className="border p-4 rounded shadow-md w-full max-w-md">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold">{seller.name}</h2>
                            <div className="flex space-x-2">
                                <IconButton aria-label="update" size="small" onClick={() => handleOpenUpdate(seller)}>
                                    <UpdateIcon />
                                </IconButton>
                                <IconButton aria-label="delete" size="small" onClick={() => deleteSeller(seller.seller_id!)}>
                                    <DeleteIcon />
                                </IconButton>
                            </div>
                        </div>
                        <p>Email: {seller.email}</p>
                        <p>Téléphone: {seller.phone}</p>
                    </li>
                ))}
            </ul>

            {/* Modal pour ajouter un seller */}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="add-seller-modal"
                aria-describedby="modal-to-add-seller"
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
                    <Typography variant="h6" id="add-seller-modal">
                        Ajouter un nouveau Seller
                    </Typography>

                    <TextField
                        label="Nom"
                        variant="outlined"
                        fullWidth
                        name="name"
                        value={newSeller.name}
                        onChange={handleInputChange}
                        className="mb-4"
                    />

                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        name="email"
                        value={newSeller.email}
                        onChange={handleInputChange}
                        className="mb-4"
                    />

                    <TextField
                        label="Téléphone"
                        variant="outlined"
                        fullWidth
                        name="phone"
                        value={newSeller.phone}
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

            {/* Modal pour mettre à jour un seller */}
            <Modal
                open={openUpdate}
                onClose={handleCloseUpdate}
                aria-labelledby="update-seller-modal"
                aria-describedby="modal-to-update-seller"
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
                    <Typography variant="h6" id="update-seller-modal">
                        Modifier un Seller
                    </Typography>

                    <TextField
                        label="Nom"
                        variant="outlined"
                        fullWidth
                        name="name"
                        value={newSeller.name}
                        onChange={handleInputChange}
                        className="mb-4"
                    />

                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        name="email"
                        value={newSeller.email}
                        onChange={handleInputChange}
                        className="mb-4"
                    />

                    <TextField
                        label="Téléphone"
                        variant="outlined"
                        fullWidth
                        name="phone"
                        value={newSeller.phone}
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
                            Modifier
                        </Button>
                    </div>
                </Box>
            </Modal>
        </div>
    );

};

export default SellerList;