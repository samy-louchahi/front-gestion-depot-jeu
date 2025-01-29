import React, { useEffect, useState } from 'react';
import { Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Buyer } from '../../types';
import { getBuyers, deleteBuyer } from '../../services/buyerService';
import BuyerForm from './BuyerForm';
import ConfirmationDialog from '../common/ConfirmationDialog';
import BuyerCard from './BuyerCard';

const BuyerList: React.FC = () => {
    const [buyers, setBuyers] = useState<Buyer[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [openForm, setOpenForm] = useState<boolean>(false);
    const [selectedBuyer, setSelectedBuyer] = useState<Buyer | null>(null);
    const [openConfirm, setOpenConfirm] = useState<boolean>(false);
    const [buyerToDelete, setBuyerToDelete] = useState<number | null>(null);
    const [openDetailModal, setOpenDetailModal] = useState<boolean>(false);
    const [detailBuyer, setDetailBuyer] = useState<Buyer | null>(null);

    const fetchBuyers = async () => {
        setLoading(true);
        try {
            const data = await getBuyers();
            setBuyers(data);
            setError(null);
        } catch (err: any) {
            console.error(err);
            setError('Erreur lors de la récupération des acheteurs.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBuyers();
    }, []);

    const handleDelete = (buyer_id: number) => {
        setBuyerToDelete(buyer_id);
        setOpenConfirm(true);
    };

    const confirmDelete = async () => {
        if (buyerToDelete === null) return;
        try {
            await deleteBuyer(buyerToDelete);
            setBuyers(buyers.filter(buyer => buyer.buyer_id !== buyerToDelete));
            setError(null);
        } catch (err: any) {
            console.error(err);
            setError('Erreur lors de la suppression du buyer.');
        } finally {
            setOpenConfirm(false);
            setBuyerToDelete(null);
        }
    };

    const cancelDelete = () => {
        setOpenConfirm(false);
        setBuyerToDelete(null);
    };

    const handleUpdate = (buyer: Buyer) => {
        setSelectedBuyer(buyer);
        setOpenForm(true);
    };

    const handleAdd = () => {
        setSelectedBuyer(null);
        setOpenForm(true);
    };

    const handleFormClose = () => {
        setOpenForm(false);
        setSelectedBuyer(null);
        fetchBuyers(); // Rafraîchir la liste après ajout/mise à jour
    };

    const handleViewDetails = (buyer: Buyer) => {
        setDetailBuyer(buyer);
        setOpenDetailModal(true);
    };

    const handleDetailModalClose = () => {
        setOpenDetailModal(false);
        setDetailBuyer(null);
    };

    if (loading) {
        return <Typography className="text-center mt-10">Chargement...</Typography>;
    }

    return (
        <div className="p-4">
            <div className="flex flex-col items-center mb-6">
                <Typography variant="h4" className="mb-4">
                    Liste des Acheteurs
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAdd}
                    className="bg-blue-500 hover:bg-blue-600"
                >
                    Ajouter un Acheteur
                </Button>
            </div>
            {error && <Typography color="error" className="text-center mb-4">{error}</Typography>}
            <ul className="space-y-4 w-full max-w-md mx-auto">
                {buyers.map((buyer) => (
                    <BuyerCard
                        key={buyer.buyer_id}
                        buyer={buyer}
                        onUpdate={handleUpdate}
                        onDelete={handleDelete}
                        onViewDetails={handleViewDetails}
                    />
                ))}
            </ul>

            {/* Formulaire Ajout/Mise à Jour */}
            <BuyerForm
                open={openForm}
                onClose={handleFormClose}
                buyer={selectedBuyer}
                onSuccess={fetchBuyers}
            />

            {/* Dialogue de Confirmation Suppression */}
            <ConfirmationDialog
                open={openConfirm}
                title="Confirmer la Suppression"
                content="Êtes-vous sûr de vouloir supprimer cet acheteur ?"
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />
        </div>
    );
};

export default BuyerList;