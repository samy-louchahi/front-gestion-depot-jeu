import React, { useEffect, useState } from 'react';
import { Button, Typography, Box, FormControl, Select, MenuItem, InputLabel } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DepositCard from './DepositCard';
import AddDepositModal from './AddDepositModal';
import { Deposit, Session } from '../../types';
import { getAllDeposits, deleteDeposit } from '../../services/depositService';
import { getSessions } from '../../services/sessionService';

const DepositList: React.FC = () => {
    const [deposits, setDeposits] = useState<Deposit[]>([]);
    const [filteredDeposits, setFilteredDeposits] = useState<Deposit[]>([]);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [selectedSession, setSelectedSession] = useState<number | 'all'>('all');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [openAdd, setOpenAdd] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [depositsData, sessionsData] = await Promise.all([getAllDeposits(), getSessions()]);
                setDeposits(depositsData);
                setSessions(sessionsData);
                setFilteredDeposits(depositsData);
                setError(null);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Erreur lors de la récupération des données.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSessionChange = (sessionId: number | 'all') => {
        setSelectedSession(sessionId);
        if (sessionId === 'all') {
            setFilteredDeposits(deposits);
        } else {
            setFilteredDeposits(deposits.filter(deposit => deposit.session_id === sessionId));
        }
    };

    const handleAddDeposit = (newDeposit: Deposit) => {
        setDeposits(prev => [...prev, newDeposit]);
        if (selectedSession === 'all' || newDeposit.session_id === selectedSession) {
            setFilteredDeposits(prev => [...prev, newDeposit]);
        }
    };

    if (loading) {
        return <Typography className="text-center mt-10">Chargement...</Typography>;
    }

    return (
        <Box className="container mx-auto p-6 space-y-8">
            {/* En-tête */}
            <Box className="flex justify-between items-center mb-6">
                <Typography variant="h4" className="font-bold text-gray-800">
                    Liste des Dépôts
                </Typography>
                <button
                onClick={() => setOpenAdd(true)}
                className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-full shadow-lg transition duration-300"
                >
                + Nouveau Dépot
                </button>
            </Box>

            {/* Sélecteur de session */}
            <FormControl fullWidth className="mb-6">
                <InputLabel id="session-select-label">Filtrer par Session</InputLabel>
                <Select
                    labelId="session-select-label"
                    value={selectedSession}
                    onChange={(e) => handleSessionChange(e.target.value as number | 'all')}
                >
                    <MenuItem value="all">Toutes les Sessions</MenuItem>
                    {sessions.map(session => (
                        <MenuItem key={session.session_id} value={session.session_id}>
                            {session.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Message d'erreur */}
            {error && (
                <Typography className="text-center mb-4 text-red-500">
                    {error}
                </Typography>
            )}

            {/* Liste des dépôts */}
            <Box className="grid grid-cols-1 gap-8">
                {filteredDeposits.length > 0 ? (
                    filteredDeposits.map(deposit => (
                        <DepositCard
                            key={deposit.deposit_id}
                            deposit={deposit}
                            onDelete={() => {}}
                            onUpdate={() => {}}
                        />
                    ))
                ) : (
                    <Typography className="text-center" variant="h6">
                        Aucun dépôt disponible.
                    </Typography>
                )}
            </Box>

            {/* Modal d'ajout */}
            <AddDepositModal
                open={openAdd}
                onClose={() => setOpenAdd(false)}
                onAdd={handleAddDeposit}
            />
        </Box>
    );
};

export default DepositList;