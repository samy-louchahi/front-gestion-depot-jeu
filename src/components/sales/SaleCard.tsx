// src/components/sales/SaleCard.tsx

import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Sale, Seller } from '../../types';
import { formatCurrency } from '../../utils/formatCurrency';

interface SaleCardProps {
  sale: Sale;
  onDelete: (id: number) => void;
  onUpdate: (sale: Sale) => void;
  onFinalize?: () => void; 
  seller?: Seller;
}

const SaleCard: React.FC<SaleCardProps> = ({
  sale,
  onDelete,
  onUpdate,
  onFinalize,
  seller
}) => {

  // 1) Calcul du total de la vente
  //    On parcourt chaque SaleDetail, et on somme les Q premiers exemplaires du DepositGame
  const totalSale = sale.SaleDetails?.reduce((acc, detail) => {
    const exemplaires = detail.DepositGame?.exemplaires || [];
    // On prend la quantité vendue
    const soldExemplaires = Object.values(exemplaires).slice(0, detail.quantity);
    // Sous-total pour ce détail
    const subTotal = soldExemplaires.reduce((subSum: number, ex: { price: number }) => subSum + ex.price, 0);
    return acc + subTotal;
  }, 0) || 0;

  // 2) Commission de la session
  const commission = sale.Session?.commission || 0;

  // 3) Liste des jeux vendus (détails)
  //    On prépare les lignes du tableau : un "SaleDetail" par jeu.
  //    On en profite pour calculer sousTotal par detail.
  const detailsRows = sale.SaleDetails?.map((detail) => {
    const exemplaires = detail.DepositGame?.exemplaires || [];
    const soldExemplaires = Object.values(exemplaires).slice(0, detail.quantity);

    // On calcule le sous-total
    const subTotal = soldExemplaires.reduce((subSum: number, ex: { price: number }) => subSum + ex.price, 0);
    console.log("deposit game", detail.DepositGame?.Game);
    return {
      deposit_game_id: detail.DepositGame?.deposit_game_id,
      gameName: detail.DepositGame?.Game?.name || 'Jeu inconnu',
      quantity: detail.quantity,
      subTotal
    };
  }) || [];

  return (
    <Box className="bg-white shadow-md rounded-lg p-6 space-y-4 border border-gray-300">
      {/* Ligne supérieure : titre + boutons */}
      <Box className="flex justify-between items-center mb-2">
        <Typography variant="h6" className="font-bold text-gray-800">
          Vente #{sale.sale_id}
        </Typography>
        <Box>
          <IconButton onClick={() => onUpdate(sale)} size="small">
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={() => sale.sale_id !== undefined && onDelete(sale.sale_id!)}
            size="small"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Informations principales */}
      <Typography variant="body2" className="font-medium text-blue-700">
        Statut : <strong>{sale.sale_status}</strong>
      </Typography>
      <Typography variant="body2" className="font-medium text-blue-700">
        Vendeur : {seller?.name || 'N/A'}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Date de vente : {new Date(sale.sale_date).toLocaleDateString()}
      </Typography>

      {/* Tableau des jeux vendus */}
      {detailsRows.length > 0 && (
        <Box>
          <Typography variant="subtitle1" className="mt-3 font-semibold text-gray-800">
            Jeux vendus :
          </Typography>
          <TableContainer component={Paper} className="mt-1">
            <Table size="small">
              <TableHead>
                <TableRow className="bg-gray-100">
                  <TableCell><strong>Jeu</strong></TableCell>
                  <TableCell align="right"><strong>Quantité</strong></TableCell>
                  <TableCell align="right"><strong>Sous-Total</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {detailsRows.map((row, idx) => (
                  <TableRow key={row.deposit_game_id || idx} className="hover:bg-gray-50">
                    <TableCell>{row.gameName}</TableCell>
                    <TableCell align="right">{row.quantity}</TableCell>
                    <TableCell align="right" className="font-medium">
                      {formatCurrency(row.subTotal)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Totaux */}
      <Box className="pt-2 space-y-1">
        <Typography variant="body1" className="font-semibold">
          Total : {formatCurrency(totalSale)} €
        </Typography>
        <Typography variant="body2">
          Commission : {commission} %
        </Typography>
      </Box>

      {/* Bouton "Finaliser" si la vente est en cours */}
      {sale.sale_status === 'en cours' && onFinalize && (
        <Box className="mt-4">
          <Button variant="contained" color="secondary" onClick={onFinalize}>
            Finaliser
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default SaleCard;