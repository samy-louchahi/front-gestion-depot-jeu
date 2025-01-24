// src/components/deposits/DepositCard.tsx

import React from 'react';
import { IconButton, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateIcon from '@mui/icons-material/Update';
import { Deposit, DepositGame } from '../../types';
import { formatCurrency } from '../../utils/formatCurrency';

interface DepositCardProps {
    deposit: Deposit;
    onDelete: (id: number) => void;
    onUpdate: (deposit: Deposit) => void;
}

const DepositCard: React.FC<DepositCardProps> = ({ deposit, onDelete, onUpdate }) => {
    return (
        <Box
            className="bg-white shadow-md rounded-lg p-4 border border-gray-300"
        >
            <Box className="flex justify-between items-center mb-2">
                <Typography variant="h6" component="h2">
                    Dépôt ID: {deposit.deposit_id}
                </Typography>
                <Box>
                    <IconButton
                        aria-label="update"
                        size="small"
                        onClick={() => onUpdate(deposit)}
                    >
                        <UpdateIcon />
                    </IconButton>
                    <IconButton
                        aria-label="delete"
                        size="small"
                        onClick={() => deposit.deposit_id && onDelete(deposit.deposit_id)}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Box>
            </Box>
            <Typography variant="body2" color="textSecondary">
                Vendeur: {deposit.Seller?.name || 'N/A'}
            </Typography>
            {deposit.Session && deposit.Session.status === true && (
                <Typography variant="body2" color="textSecondary">
                    Session: {deposit.Session.name || 'N/A'}
                </Typography>
            )}
            <Typography variant="body2" color="textSecondary">
                Date de Dépôt: {new Date(deposit.deposit_date).toLocaleDateString()}
            </Typography>
            <Typography variant="body2" color="textSecondary">
                Réduction sur les Frais: {deposit.discount_fees ? `${deposit.discount_fees}%` : 'N/A'}
            </Typography>
            <Typography variant="body1" className="font-semibold mt-2">
                Jeux Déposés:
            </Typography>
            {deposit.DepositGames && deposit.DepositGames.length > 0 ? (
                <TableContainer component={Paper} className="mt-2">
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Jeu</TableCell>
                                <TableCell align="right">Prix (€)</TableCell>
                                <TableCell align="right">Frais (%)</TableCell>
                                <TableCell align="right">Quantité</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {deposit.DepositGames.map((game: DepositGame) => (
                                <TableRow key={game.deposit_game_id}>
                                    <TableCell>{game.Game?.name || 'N/A'}</TableCell>
                                    <TableCell align="right">{formatCurrency(parseFloat(game.price.toString()))}</TableCell>
                                    <TableCell align="right">{game.fees}%</TableCell>
                                    <TableCell align="right">{game.quantity}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Typography variant="body2" color="textSecondary">
                    Aucun jeu déposé.
                </Typography>
            )}
        </Box>
    );
};
export default DepositCard;
