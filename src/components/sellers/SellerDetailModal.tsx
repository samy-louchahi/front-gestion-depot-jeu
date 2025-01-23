// src/components/sellers/SellerDetailModal.tsx

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
import { Seller, Stock, Sale, Balance } from '../../types';
import { getSellerStocks, getSellerSales, getSellerBalance } from '../../services/sellerService';
import { formatCurrency } from '../../utils/formatCurrency';

interface SellerDetailModalProps {
    open: boolean;
    onClose: () => void;
    seller: Seller;
}

const SellerDetailModal: React.FC<SellerDetailModalProps> = ({ open, onClose, seller }) => {
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [sales, setSales] = useState<Sale[]>([]);
    const [balance, setBalance] = useState<Balance | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Suppose que la session actuelle est identifiée quelque part, par exemple via le contexte ou les props
    const currentSessionId = 1; // Remplace par la logique appropriée

    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            try {
                const [stocksData, salesData, balanceData] = await Promise.all([
                    getSellerStocks(seller.seller_id),
                    getSellerSales(seller.seller_id),
                    getSellerBalance(currentSessionId, seller.seller_id)
                ]);
                setStocks(stocksData);
                setSales(salesData);
                setBalance(balanceData);
                setError(null);
            } catch (err: any) {
                console.error(err);
                setError('Erreur lors de la récupération des détails du vendeur.');
            } finally {
                setLoading(false);
            }
        };

        if (open) {
            fetchDetails();
        }
    }, [open, seller]);

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="seller-detail-title"
            aria-describedby="seller-detail-description"
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
                    <Typography variant="h5" id="seller-detail-title">
                        Détails du Vendeur: {seller.name}
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
                ) : (
                    <Box className="mt-4 space-y-8">
                        {/* Informations Générales */}
                        <Box>
                            <Typography variant="h6" className="mb-2 text-blue-600">
                                Informations Générales
                            </Typography>
                            <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Typography variant="body1">
                                    <strong>Email:</strong> {seller.email}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Téléphone:</strong> {seller.phone}
                                </Typography>
                            </Box>
                        </Box>

                        {/* Stocks (Jeux Possédés) */}
                        <Box>
                            <Typography variant="h6" className="mb-2 text-blue-600">
                                Jeux Possédés (Stocks)
                            </Typography>
                            {stocks.length > 0 ? (
                                <TableContainer component={Paper} className="rounded-lg">
                                    <Table>
                                        <TableHead>
                                            <TableRow className="bg-gray-100">
                                                <TableCell><strong>Nom du Jeu</strong></TableCell>
                                                <TableCell align="right"><strong>Quantité Initiale</strong></TableCell>
                                                <TableCell align="right"><strong>Quantité Actuelle</strong></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {stocks.map(stock => (
                                                <TableRow key={stock.stock_id} className="hover:bg-gray-50 transition-colors duration-200">
                                                    <TableCell>{stock.Game?.name || 'N/A'}</TableCell>
                                                    <TableCell align="right">{stock.initial_quantity}</TableCell>
                                                    <TableCell align="right">{stock.current_quantity}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            ) : (
                                <Typography>Aucun stock disponible.</Typography>
                            )}
                        </Box>

                        {/* Ventes */}
                        <Box>
                            <Typography variant="h6" className="mb-2 text-blue-600">
                                Ventes Effectuées
                            </Typography>
                            {sales.length > 0 ? (
                                <TableContainer component={Paper} className="rounded-lg">
                                    <Table>
                                        <TableHead>
                                            <TableRow className="bg-gray-100">
                                                <TableCell><strong>ID Vente</strong></TableCell>
                                                <TableCell><strong>Acheteur</strong></TableCell>
                                                <TableCell><strong>Date de Vente</strong></TableCell>
                                                <TableCell><strong>Détails</strong></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {sales.map(sale => (
                                                <TableRow key={sale.sale_id} className="hover:bg-gray-50 transition-colors duration-200">
                                                    <TableCell>{sale.sale_id}</TableCell>
                                                    <TableCell>{sale.Buyer?.name || 'N/A'}</TableCell>
                                                    <TableCell>
                                                        {new Date(sale.sale_date).toLocaleDateString('fr-FR', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </TableCell>
                                                    <TableCell>
                                                        {sale.SaleDetail?.length ?? 0 > 0 ? (
                                                            (sale.SaleDetail ?? []).map(detail => (
                                                                <Typography key={detail.sale_detail_id} variant="body2">
                                                                    {detail.DepositGame?.Game?.name || 'N/A'} - Quantité: {detail.quantity}
                                                                </Typography>
                                                            ))
                                                        ) : (
                                                            'Aucun détail'
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            ) : (
                                <Typography>Aucune vente effectuée.</Typography>
                            )}
                        </Box>

                        {/* Solde Financier */}
                        <Box>
                            <Typography variant="h6" className="mb-2 text-blue-600">
                                Solde Financier
                            </Typography>
                            {balance ? (
                                <Box className="space-y-2">
                                    <Typography variant="body1">
                                        <strong>Frais de Dépôt:</strong> {formatCurrency(balance.totalDepositFees)}
                                    </Typography>
                                    <Typography variant="body1">
                                        <strong>Total Ventes:</strong> {formatCurrency(balance.totalSales)}
                                    </Typography>
                                    <Typography variant="body1">
                                        <strong>Total Commissions:</strong> {formatCurrency(balance.totalCommission)}
                                    </Typography>
                                    <Divider className="my-2" />
                                    <Typography variant="h6" className="text-green-600">
                                        <strong>Bénéfice Total du vendeur:</strong> {formatCurrency(balance.totalBenef)}
                                    </Typography>
                                </Box>
                            ) : (
                                <Typography>Aucune donnée financière disponible.</Typography>
                            )}
                        </Box>
                    </Box>
                )}
            </Box>
        </Modal>
    );
}

export default SellerDetailModal;