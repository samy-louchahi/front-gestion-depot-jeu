// src/components/sessions/SessionDetailModal.tsx

import React, { useEffect, useState } from 'react';
import {
    Modal,
    Box,
    Typography,
    Divider,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { getGlobalBalanceBySession } from '../../services/sessionService'; // Ajouter ce service
import { Balance } from '../../types';
import { formatCurrency } from '../../utils/formatCurrency';

interface SessionDetailModalProps {
    open: boolean;
    onClose: () => void;
    session_id: number;
}

const SessionDetailModal: React.FC<SessionDetailModalProps> = ({ open, onClose, session_id }) => {
    const [balance, setBalance] = useState<Balance | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBalance = async () => {
            setLoading(true);
            try {
                const data = await getGlobalBalanceBySession(session_id);
                setBalance(data);
                setError(null);
            } catch (err: any) {
                console.error(err);
                setError('Erreur lors de la récupération du bilan financier de la session.');
            } finally {
                setLoading(false);
            }
        };

        if (open) {
            fetchBalance();
        }
    }, [open, session_id]);

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="session-detail-title"
            aria-describedby="session-detail-description"
        >
            <Box
                className="bg-white p-6 rounded-lg w-full max-w-5xl mx-auto mt-10 overflow-auto shadow-lg"
                sx={{
                    position: 'absolute' as 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    maxHeight: '90vh',
                    width: '90%',
                }}
            >
                {/* Header avec Titre et Bouton de Fermeture */}
                <Box className="flex justify-between items-center mb-4">
                    <Typography variant="h5" id="session-detail-title">
                        Détails Financiers de la Session
                    </Typography>
                    <IconButton onClick={onClose} aria-label="close" size="large">
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Divider />

                {/* Contenu Principal */}
                {loading ? (
                    <Box className="flex justify-center items-center h-64">
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Typography color="error" className="text-center mt-10">
                        {error}
                    </Typography>
                ) : balance ? (
                    <Box className="mt-4 space-y-8">
                        {/* Bilans Financiers */}
                        <Box>
                            <Typography variant="h6" className="mb-2 text-blue-600">
                                Bilan Financier Global
                            </Typography>
                            <TableContainer component={Paper} className="rounded-lg">
                                <Table>
                                    <TableHead>
                                        <TableRow className="bg-gray-100">
                                            <TableCell><strong>Frais de Dépôt Totaux</strong></TableCell>
                                            <TableCell align="right"><strong>Total des Ventes</strong></TableCell>
                                            <TableCell align="right"><strong>Total des Commissions</strong></TableCell>
                                            <TableCell align="right"><strong>Bénéfice Total</strong></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow className="hover:bg-gray-50 transition-colors duration-200">
                                            <TableCell>{formatCurrency(balance.totalDepositFees)}</TableCell>
                                            <TableCell align="right">{formatCurrency(balance.totalSales)}</TableCell>
                                            <TableCell align="right">{formatCurrency(balance.totalCommission)}</TableCell>
                                            <TableCell align="right" className="font-semibold text-green-600">
                                                {formatCurrency(balance.totalBenef)}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </Box>
                ) : (
                    <Typography className="text-center mt-10" variant="h6">
                        Aucun bilan disponible pour cette session.
                    </Typography>
                )}
            </Box>
        </Modal>
    );
};

export default SessionDetailModal;