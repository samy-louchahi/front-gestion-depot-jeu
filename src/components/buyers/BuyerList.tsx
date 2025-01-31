import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
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
            setError('Erreur lors de la suppression de l\'acheteur.');
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

    if (loading) {
        return <Typography className="text-center mt-10">Chargement...</Typography>;
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <Typography variant='h4' className="text-3xl font-extrabold text-gray-800">
                    Liste des Acheteurs
                </Typography>
                <button
                    onClick={handleAdd}
                    className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-full shadow-lg transition duration-300"
                >
                    + Ajouter un Acheteur
                </button>
            </div>
            {error && <Typography color="error" className="text-center mb-4">{error}</Typography>}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {buyers.length > 0 ? (
                    buyers.map((buyer) => (
                        <BuyerCard
                            key={buyer.buyer_id}
                            buyer={buyer}
                            onUpdate={handleUpdate}
                            onDelete={handleDelete}
                        />
                    ))
                ) : (
                    <Typography className="text-center w-full" variant="h6">
                        Aucun acheteur disponible.
                    </Typography>
                )}
            </div>

            <BuyerForm
                open={openForm}
                onClose={handleFormClose}
                buyer={selectedBuyer}
                onSuccess={fetchBuyers}
            />

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