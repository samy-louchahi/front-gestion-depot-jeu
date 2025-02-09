// src/components/sales/SaleCard.tsx

import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Sale, Seller } from '../../types';
import { formatCurrency } from '../../utils/formatCurrency';

interface SaleCardProps {
  sale: Sale;
  onDelete: (id: number) => void;
  onUpdate: (sale: Sale) => void;
  seller?: Seller;
}

const SaleCard: React.FC<SaleCardProps> = ({ sale, onDelete, onUpdate, seller }) => {
  // Pour chaque détail de vente, on récupère le tableau des exemplaires depuis DepositGame.
  // On somme le prix des exemplaires vendus (les N premiers, où N = detail.quantity)
  const totalSale = sale.SaleDetails?.reduce((acc, detail) => {
    const exemplaires = detail.DepositGame?.exemplaires || [];
    const soldExemplaires = Array.isArray(exemplaires) ? exemplaires.slice(0, detail.quantity) : [];
    const soldPrice = soldExemplaires.reduce((sum, ex: { price: number }) => sum + ex.price, 0);
    return acc + soldPrice;
  }, 0) || 0;

  const commission = sale.Session?.commission || 0;

  return (
    <Box className="bg-white shadow-md rounded-lg p-6 space-y-4 border border-gray-300">
      <Box className="flex justify-between items-center">
        <Typography variant="h6" className="font-bold text-gray-800">
          Vente #{sale.sale_id}
        </Typography>
        <Box>
          <IconButton onClick={() => onUpdate(sale)} size="small">
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => sale.sale_id !== undefined && onDelete(sale.sale_id)} size="small">
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>
      <Typography variant="body2" className="font-medium text-blue-700">
        Vendeur : {seller?.name}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Date: {new Date(sale.sale_date).toLocaleDateString()}
      </Typography>
      <Typography variant="body1" className="font-semibold">
        Total: {formatCurrency(totalSale)} €
      </Typography>
      <Typography variant="body2">Commission: {commission} %</Typography>
    </Box>
  );
};

export default SaleCard;