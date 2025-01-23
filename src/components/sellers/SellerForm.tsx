// src/components/sellers/SellerForm.tsx

import React, { useState, useEffect } from 'react';
import { Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import ModalForm from '../common/ModalForm';
import { Seller } from '../../types';
import { createSeller, updateSeller } from '../../services/sellerService';
interface SellerFormProps {
    open: boolean;
    onClose: () => void;
    seller: Seller | null;
}

const SellerForm: React.FC<SellerFormProps> = ({ open, onClose, seller }) => {
    const [formData, setFormData] = useState<Omit<Seller, 'seller_id'>>({
        name: '',
        email: '',
        phone: '',
    });
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (seller) {
            setFormData({
                name: seller.name,
                email: seller.email,
                phone: seller.phone,
            });
        } else {
            setFormData({
                name: '',
                email: '',
                phone: '',
            });
        }
    }, [seller]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async () => {
        const { name, email, phone} = formData;

        // Validation des champs
        if (!name || !email || !phone) {
            setError('Veuillez remplir tous les champs obligatoires.');
            return;
        }

        try {
            if (seller) {
                await updateSeller(seller.seller_id, formData);
            } else {
                await createSeller(formData);
            }
            setError(null);
            onClose();
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.error || 'Erreur lors de l\'opération.');
        }
    };

    return (
        <ModalForm
            open={open}
            onClose={onClose}
            title={seller ? 'Modifier le Vendeur' : 'Ajouter un Vendeur'}
        >
            <TextField
                label="Nom"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Téléphone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    {seller ? 'Modifier' : 'Ajouter'}
                </Button>
                <Button variant="outlined" color="secondary" onClick={onClose}>
                    Annuler
                </Button>
            </div>
        </ModalForm>
    );
};

export default SellerForm;