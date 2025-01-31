import React from 'react';
import { Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Deposit, DepositGame } from '../../types';
import { formatCurrency } from '../../utils/formatCurrency';

interface DepositCardProps {
    deposit: Deposit;
    onDelete: (id: number) => void;
    onUpdate: (deposit: Deposit) => void;
}

const DepositCard: React.FC<DepositCardProps> = ({ deposit, onDelete, onUpdate }) => {
    return (
        <Box className="bg-white shadow-md rounded-lg p-8 space-y-6 border border-gray-300">
            {/* En-tête de la carte */}
            <Box className="flex justify-between items-center">
                <Typography variant="h6" className="font-bold text-gray-800">
                    Dépôt #{deposit.deposit_id}
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                    {new Date(deposit.deposit_date).toLocaleDateString()}
                </Typography>
            </Box>

            {/* Informations du vendeur */}
            <Box className="text-gray-800 space-y-1">
                <Typography variant="body1" className="font-medium">
                    Vendeur : {deposit.Seller?.name || 'N/A'}
                </Typography>
                <Typography variant="body2">
                    Réduction des frais : {deposit.discount_fees ? `${deposit.discount_fees}%` : 'N/A'}
                </Typography>
            </Box>

            {/* Section des jeux déposés */}
            <Typography variant="h6" className="mt-4 font-semibold">Jeux Déposés</Typography>
            <TableContainer component={Paper}>
                <Table size="small" className="rounded-lg overflow-hidden">
                    <TableHead className="bg-gray-200">
                        <TableRow>
                            <TableCell className="font-bold">Jeu</TableCell>
                            <TableCell align="right" className="font-bold">Prix (€)</TableCell>
                            <TableCell align="right" className="font-bold">Frais (%)</TableCell>
                            <TableCell align="right" className="font-bold">Quantité</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {deposit.DepositGames?.map((game: DepositGame) => (
                            <TableRow key={game.deposit_game_id} className="hover:bg-gray-50 transition">
                                <TableCell>{game.Game?.name || 'N/A'}</TableCell>
                                <TableCell align="right">{formatCurrency(parseFloat(game.price.toString()))}</TableCell>
                                <TableCell align="right">{game.fees}%</TableCell>
                                <TableCell align="right">{game.quantity}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default DepositCard;