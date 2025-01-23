// src/components/sellers/SellerList.tsx

import React, { useEffect, useState } from 'react';
import { Button, IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateIcon from '@mui/icons-material/Update';
import { Seller } from '../../types';
import { getSellers, deleteSeller } from '../../services/sellerService';
import SellerForm from './SellerForm';
import ConfirmationDialog from '../common/ConfirmationDialog';
import SellerCard from './SellerCard';
import SellerDetailModal from './SellerDetailModal';

const SellerList: React.FC = () => {
    const [sellers, setSellers] = useState<Seller[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [openForm, setOpenForm] = useState<boolean>(false);
    const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
    const [openConfirm, setOpenConfirm] = useState<boolean>(false);
    const [sellerToDelete, setSellerToDelete] = useState<number | null>(null);
    const [openDetailModal, setOpenDetailModal] = useState<boolean>(false);
    const [detailSeller, setDetailSeller] = useState<Seller | null>(null);

    const fetchSellers = async () => {
        try {
            const data = await getSellers();
            setSellers(data);
        } catch (err: any) {
            console.error(err);
            setError('Erreur lors de la récupération des vendeurs.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSellers();
    }, []);

    const handleDelete = (id: number) => {
        setSellerToDelete(id);
        setOpenConfirm(true);
    };

    const confirmDelete = async () => {
        if (sellerToDelete === null) return;
        try {
            await deleteSeller(sellerToDelete);
            setSellers(sellers.filter(seller => seller.seller_id !== sellerToDelete));
            setError(null);
        } catch (err: any) {
            console.error(err);
            setError('Erreur lors de la suppression du vendeur.');
        } finally {
            setOpenConfirm(false);
            setSellerToDelete(null);
        }
    };

    const cancelDelete = () => {
        setOpenConfirm(false);
        setSellerToDelete(null);
    };

    const handleUpdate = (seller: Seller) => {
        setSelectedSeller(seller);
        setOpenForm(true);
    };

    const handleAdd = () => {
        setSelectedSeller(null);
        setOpenForm(true);
    };

    const handleFormClose = () => {
        setOpenForm(false);
        setSelectedSeller(null);
        fetchSellers(); // Rafraîchir la liste après ajout/mise à jour
    };

    const handleViewDetails = (seller: Seller) => {
        setDetailSeller(seller);
        setOpenDetailModal(true);
    };

    const handleDetailModalClose = () => {
        setOpenDetailModal(false);
        setDetailSeller(null);
    };

    if (loading) {
        return <Typography className="text-center mt-10">Chargement...</Typography>;
    }

    return (
        <div className="p-4">
            <div className="flex flex-col items-center mb-6">
                <Typography variant="h4" className="mb-4">
                    Liste des Vendeurs
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAdd}
                    className="bg-blue-500 hover:bg-blue-600"
                >
                    Ajouter un Vendeur
                </Button>
            </div>
            {error && <Typography color="error" className="text-center mb-4">{error}</Typography>}
            <div className="flex justify-center">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {sellers.map((seller) => (
                        <SellerCard
                            key={seller.seller_id}
                            seller={seller}
                            onUpdate={handleUpdate}
                            onDelete={handleDelete}
                            onViewDetails={handleViewDetails}
                        />
                    ))}
                </div>
            </div>

            {/* Formulaire Ajout/Mise à Jour */}
            <SellerForm
                open={openForm}
                onClose={handleFormClose}
                seller={selectedSeller}
            />

            {/* Dialogue de Confirmation Suppression */}
            <ConfirmationDialog
                open={openConfirm}
                title="Confirmer la Suppression"
                content="Êtes-vous sûr de vouloir supprimer ce vendeur ?"
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />

            {/* Modal Détail Vendeur */}
            {detailSeller && (
                <SellerDetailModal
                    open={openDetailModal}
                    onClose={handleDetailModalClose}
                    seller={detailSeller}
                />
            )}
        </div>
    );
};

export default SellerList;