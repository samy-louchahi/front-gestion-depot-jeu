// src/components/deposits/DepositList.tsx

import React, { useEffect, useState } from 'react';
import { Button, Typography, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DepositCard from './DepositCard';
import AddDepositModal from './AddDepositModal';
import { Deposit } from '../../types';
import { getAllDeposits, deleteDeposit } from '../../services/depositService';

const DepositList: React.FC = () => {
    const [deposits, setDeposits] = useState<Deposit[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [openAdd, setOpenAdd] = useState<boolean>(false);
    const [openUpdate, setOpenUpdate] = useState<boolean>(false);
    const [currentDeposit, setCurrentDeposit] = useState<Deposit | null>(null);

    const fetchDeposits = async () => {
        try {
            const data = await getAllDeposits();
            setDeposits(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching deposits:', err);
            setError('Échec de la récupération des dépôts.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDeposits();
    }, []);

    const handleAddDeposit = (newDeposit: Deposit) => {
        setDeposits(prev => [...prev, newDeposit]);
    };

    const handleUpdateDeposit = (updatedDeposit: Deposit) => {
        setDeposits(prev =>
            prev.map(deposit => deposit.deposit_id === updatedDeposit.deposit_id ? updatedDeposit : deposit)
        );
    };

    const handleDeleteDeposit = async (id: number) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce dépôt ?')) {
            try {
                await deleteDeposit(id);
                setDeposits(prev => prev.filter(deposit => deposit.deposit_id !== id));
                setError(null);
            } catch (err) {
                console.error('Error deleting deposit:', err);
                setError('Échec de la suppression du dépôt.');
            }
        }
    };

    const handleOpenUpdate = (deposit: Deposit) => {
        setCurrentDeposit(deposit);
        setOpenUpdate(true);
    };

    const handleCloseUpdate = () => {
        setCurrentDeposit(null);
        setOpenUpdate(false);
    };

    if (loading) {
        return <Typography className="text-center mt-10">Chargement...</Typography>;
    }

    return (
        <Box className="container mx-auto p-4">
            <Box className="flex justify-between items-center mb-4">
                <Typography variant="h4" className="font-bold">
                    Liste des Dépôts
                </Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenAdd(true)}>
                    Ajouter un Dépôt
                </Button>
            </Box>
            {error && (
                <Typography className="text-center mb-4 text-red-500">
                    {error}
                </Typography>
            )}
            <Box className="grid grid-cols-1 gap-4">
                {deposits.length > 0 ? (
                    deposits.map(deposit => (
                        <DepositCard
                            key={deposit.deposit_id}
                            deposit={deposit}
                            onDelete={handleDeleteDeposit}
                            onUpdate={handleOpenUpdate}
                        />
                    ))
                ) : (
                    <Typography className="text-center" variant="h6">
                        Aucun dépôt disponible.
                    </Typography>
                )}
            </Box>

            {/* Add Deposit Modal */}
            <AddDepositModal
                open={openAdd}
                onClose={() => setOpenAdd(false)}
                onAdd={handleAddDeposit}
            />
        </Box>
    );
};

export default DepositList;
