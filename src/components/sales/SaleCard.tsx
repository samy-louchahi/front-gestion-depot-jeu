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
import { downloadInvoice } from '../../services/invoiceService';

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
  seller,
}) => {
  // Calcul du total de la vente
  const totalSale =
    sale.SaleDetails?.reduce((acc, detail) => {
      const exemplaires = detail.DepositGame?.exemplaires || [];
      const soldExemplaires = Object.values(exemplaires).slice(0, detail.quantity);
      const subTotal = soldExemplaires.reduce(
        (subSum: number, ex: { price: number }) => subSum + ex.price,
        0
      );
      return acc + subTotal;
    }, 0) || 0;

  // Fonction pour télécharger la facture
  const handleDownloadInvoice = async () => {
    console.log('Vérification sale_id:', sale.sale_id); // Ajoutez ce log pour vérifier l'ID
    try {
      if (sale.sale_id !== undefined && sale.sale_id !== null && sale.buyer_id !== undefined && sale.buyer_id !== null) {
        await downloadInvoice(sale.sale_id, sale.buyer_id);
      } else {
        console.error('Sale ID or Buyer ID is undefined.');
      }
    } catch (error) {
      console.error('Erreur lors du téléchargement de la facture.');
    }
  };

  return (
    <Box className="bg-white shadow-md rounded-lg p-6 space-y-4 border border-gray-300">
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

      <Typography variant="body2" className="font-medium text-blue-700">
        Statut : <strong>{sale.sale_status}</strong>
      </Typography>
      <Typography variant="body2" className="font-medium text-blue-700">
        Vendeur : {seller?.name || 'N/A'}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Date de vente : {new Date(sale.sale_date).toLocaleDateString()}
      </Typography>

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
              {sale.SaleDetails?.map((detail) => (
                <TableRow key={detail.DepositGame?.deposit_game_id} className="hover:bg-gray-50">
                  <TableCell>{detail.DepositGame?.Game?.name || 'Jeu inconnu'}</TableCell>
                  <TableCell align="right">{detail.quantity}</TableCell>
                  <TableCell align="right" className="font-medium">
                    {formatCurrency(
                      Object.values(detail.DepositGame?.exemplaires || [])
                        .slice(0, detail.quantity)
                        .reduce((sum, ex) => sum + ex.price, 0)
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box className="pt-2 space-y-1">
        <Typography variant="body1" className="font-semibold">
          Total : {formatCurrency(totalSale)} €
        </Typography>
      </Box>

      {sale.sale_status === 'en cours' && onFinalize && (
        <Box className="mt-4">
          <Button variant="contained" color="secondary" onClick={onFinalize}>
            Finaliser
          </Button>
        </Box>
      )}

      {/* Bouton de téléchargement de la facture */}
      <Box className="mt-4">
        <Button variant="contained" color="primary" onClick={handleDownloadInvoice}>
          Télécharger la Facture
        </Button>
      </Box>
    </Box>
  );
};

export default SaleCard;