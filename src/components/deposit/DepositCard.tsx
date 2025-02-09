// src/components/deposits/DepositCard.tsx

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
      <Box className="flex justify-between items-center">
        <Typography variant="h6" className="font-bold text-gray-800">
          Dépôt #{deposit.deposit_id}
        </Typography>
        <Typography variant="body2" className="text-gray-600">
          {new Date(deposit.deposit_date).toLocaleDateString()}
        </Typography>
      </Box>

      <Box className="text-gray-800 space-y-1">
        <Typography variant="body1" className="font-medium">
          Vendeur : {deposit.Seller?.name || 'N/A'}
        </Typography>
        <Typography variant="body2">
          Réduction des frais : {deposit.discount_fees ? `${deposit.discount_fees}%` : 'N/A'}
        </Typography>
      </Box>

      <Typography variant="h6" className="mt-4 font-semibold">
        Jeux Déposés
      </Typography>
      <TableContainer component={Paper} className="rounded-lg">
        <Table>
          <TableHead>
            <TableRow className="bg-gray-200">
              <TableCell className="font-bold">Jeu</TableCell>
              <TableCell align="right" className="font-bold">Frais (%)</TableCell>
              <TableCell align="right" className="font-bold">Quantité</TableCell>
              <TableCell align="right" className="font-bold">Prix Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deposit.DepositGames?.map((dg: DepositGame) => {
              // La quantité est la longueur des clés de l'objet exemplaires
              const quantity = dg.exemplaires ? Object.keys(dg.exemplaires).length : 0;
              // Calcul du prix total
              const totalPrice = dg.exemplaires
                ? Object.values(dg.exemplaires).reduce((sum, ex) => sum + ex.price, 0)
                : 0;
              return (
                <TableRow key={dg.deposit_game_id} className="hover:bg-gray-50 transition">
                  <TableCell>{dg.Game?.name || 'N/A'}</TableCell>
                  <TableCell align="right">{dg.fees}%</TableCell>
                  <TableCell align="right">{quantity}</TableCell>
                  <TableCell align="right">{formatCurrency(totalPrice)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DepositCard;