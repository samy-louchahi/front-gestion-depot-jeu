import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
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
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <Typography variant='h4' className="text-3xl font-extrabold text-gray-800">
                    Liste des Vendeurs
                </Typography>
                <button
                    onClick={handleAdd}
                    className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-full shadow-lg transition duration-300"
                >
                    + Ajouter un Vendeur
                </button>
            </div>
            {error && <Typography color="error" className="text-center mb-4">{error}</Typography>}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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

            <SellerForm
                open={openForm}
                onClose={handleFormClose}
                seller={selectedSeller}
            />

            <ConfirmationDialog
                open={openConfirm}
                title="Confirmer la Suppression"
                content="Êtes-vous sûr de vouloir supprimer ce vendeur ?"
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />

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