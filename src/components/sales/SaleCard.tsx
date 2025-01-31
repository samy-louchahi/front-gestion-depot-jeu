import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Sale, Seller, Session } from '../../types';
import { getSellers } from '../../services/sellerService';
import { formatCurrency } from '../../utils/formatCurrency';

interface SaleCardProps {
    sale: Sale;
    onDelete: (id: number) => void;
    onUpdate: (sale: Sale) => void;
    seller?: Seller;
}

const SaleCard: React.FC<SaleCardProps> = ({ sale, onDelete, onUpdate, seller }) => {
    const totalSale = sale.SaleDetails?.reduce(
        (acc, detail) => acc + detail.DepositGame!.price * detail.quantity,
        0
    ) || 0;
    const commission = sale.Session?.commission || 0;
    
    // Obtenir le vendeur via les détails de la vente
   

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