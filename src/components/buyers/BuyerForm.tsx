import React, { useState, useEffect } from 'react';
import { Button, TextField, Typography } from '@mui/material';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { Buyer } from '../../types';
import { createBuyer, updateBuyer } from '../../services/buyerService';

interface BuyerFormProps {
    open: boolean;
    onClose: () => void;
    buyer: Buyer | null;
    onSuccess: () => void; // Callback pour rafraîchir la liste après l'opération
}

const BuyerForm: React.FC<BuyerFormProps> = ({ open, onClose, buyer, onSuccess }) => {
    const [formData, setFormData] = useState<Omit<Buyer, 'buyer_id'>>({
        name: '',
        email: '',
        phone: '',
        address: ''
    });
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (buyer) {
            setFormData({
                name: buyer.name,
                email: buyer.email,
                phone: buyer.phone,
                address: buyer.address
            });
        } else {
            setFormData({
                name: '',
                email: '',
                phone: '',
                address: ''
            });
        }
    }, [buyer]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        const { name, email, phone, address = '' } = formData;

        // Validation des champs
        if (!name.trim() || !email.trim() || !phone.trim() || !address.trim()) {
            setError('Veuillez remplir tous les champs obligatoires.');
            return;
        }

        try {
            if (buyer) {
                await updateBuyer(buyer.buyer_id!, formData);
            } else {
                await createBuyer(formData);
            }
            setError(null);
            onSuccess();
            onClose();
        } catch (err: any) {
            console.error('Erreur lors de l\'opération:', err);
            setError(err.response?.data?.error || 'Échec de l\'opération.');
        }
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="buyer-form-modal"
            aria-describedby="modal-to-add-or-update-buyer"
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
                <Typography variant="h6" id="buyer-form-modal">
                    {buyer ? 'Mettre à Jour le Buyer' : 'Ajouter un Nouveau Buyer'}
                </Typography>

                <TextField
                    label="Nom"
                    variant="outlined"
                    fullWidth
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                />

                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                />

                <TextField
                    label="Téléphone"
                    variant="outlined"
                    fullWidth
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                />

                <TextField
                    label="Addresse"
                    variant="outlined"
                    fullWidth
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                />

                {error && <Typography color="error">{error}</Typography>}

                <div className="flex gap-4 w-full">
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={onClose}
                        className="flex-1"
                    >
                        Annuler
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        className="flex-1"
                    >
                        {buyer ? 'Mettre à Jour' : 'Ajouter'}
                    </Button>
                </div>
            </Box>
        </Modal>
    );
};

export default BuyerForm;