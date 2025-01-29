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
import { Seller, Stock, SaleDetail, Balance, Game } from '../../types';
import { getSellerStocks, getSellerSaleDetails, getAllSellerBalances } from '../../services/sellerService';
import { formatCurrency } from '../../utils/formatCurrency';

interface SellerDetailModalProps {
    open: boolean;
    onClose: () => void;
    seller: Seller;
}

const SellerDetailModal: React.FC<SellerDetailModalProps> = ({ open, onClose, seller }) => {
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [saleDetails, setSaleDetails] = useState<SaleDetail[]>([]);
    const [balances, setBalances] = useState<Balance[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            try {
                // Récupérer les stocks, les détails des ventes et les bilans
                const [stocksData, saleDetailsData, balancesData] = await Promise.all([
                    getSellerStocks(seller.seller_id),
                    getSellerSaleDetails(seller.seller_id),
                    getAllSellerBalances(seller.seller_id)
                ]);

                // Agréger les stocks pour éviter les doublons
                const aggregatedStocks = aggregateStocks(stocksData);
                setStocks(aggregatedStocks);

                setSaleDetails(saleDetailsData);
                setBalances(balancesData);
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

    /**
     * Fonction pour agréger les stocks par jeu unique
     * @param stocks Liste des stocks récupérés du backend
     * @returns Liste des stocks agrégés
     */
    const aggregateStocks = (stocks: Stock[]): Stock[] => {
        const grouped = stocks.reduce((acc: { [key: string]: Stock }, stock: Stock) => {
            // Utiliser game_id si disponible, sinon combiner name et editor pour une clé unique
            const key = stock.game_id ? stock.game_id.toString() : `${stock.Game?.name}-${stock.Game?.publisher}`;

            if (acc[key]) {
                acc[key].initial_quantity += stock.initial_quantity;
                acc[key].current_quantity += stock.current_quantity;
            } else {
                acc[key] = { ...stock };
            }
            return acc;
        }, {});

        return Object.values(grouped);
    };

    // Vérifier si toutes les données sont vides
    const isAllDataEmpty = stocks.length === 0 && saleDetails.length === 0 && balances.length === 0;

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
                ) : isAllDataEmpty ? (
                    <Typography className="text-center mt-10" variant="h6">
                        Aucun détail disponible pour ce vendeur.
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
                                    <strong>Email :</strong> {seller.email}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Téléphone :</strong> {seller.phone}
                                </Typography>
                                {/* Supprimé : Adresse */}
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
                                                <TableRow key={stock.game_id || `${stock.Game?.name}-${stock.Game?.publisher}`} className="hover:bg-gray-50 transition-colors duration-200">
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
                            {saleDetails.length > 0 ? (
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
                                            {saleDetails.map(detail => (
                                                <TableRow key={detail.sale_detail_id} className="hover:bg-gray-50 transition-colors duration-200">
                                                    <TableCell>{detail.sale_id}</TableCell>
                                                    <TableCell>{detail.Sale?.Buyer?.name || 'N/A'}</TableCell>
                                                    <TableCell>
                                                        {detail.Sale?.sale_date
                                                            ? new Date(detail.Sale.sale_date).toLocaleDateString('fr-FR', {
                                                                  year: 'numeric',
                                                                  month: 'long',
                                                                  day: 'numeric'
                                                              })
                                                            : 'N/A'}
                                                    </TableCell>
                                                    <TableCell>
                                                        {/* Afficher les détails de la vente si nécessaire */}
                                                        {/* Par exemple : Nombre de jeux vendus, montant total, etc. */}
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

                        {/* Bilans par Session */}
                        <Box>
                            <Typography variant="h6" className="mb-2 text-blue-600">
                                Bilans par Session
                            </Typography>
                            {balances.length > 0 ? (
                                <TableContainer component={Paper} className="rounded-lg">
                                    <Table>
                                        <TableHead>
                                            <TableRow className="bg-gray-100">
                                                <TableCell><strong>Session</strong></TableCell>
                                                <TableCell align="right"><strong>Frais de Dépôt</strong></TableCell>
                                                <TableCell align="right"><strong>Total Ventes</strong></TableCell>
                                                <TableCell align="right"><strong>Total Commissions</strong></TableCell>
                                                <TableCell align="right"><strong>Bénéfice Total</strong></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {balances.map(balance => (
                                                <TableRow key={balance.session_id} className="hover:bg-gray-50 transition-colors duration-200">
                                                    <TableCell>{balance.session_id || `Session ID: ${balance.session_id}`}</TableCell>
                                                    <TableCell align="right">{formatCurrency(balance.totalDepositFees)}</TableCell>
                                                    <TableCell align="right">{formatCurrency(balance.totalSales)}</TableCell>
                                                    <TableCell align="right">{formatCurrency(balance.totalCommission)}</TableCell>
                                                    <TableCell align="right" className="font-semibold text-green-600">
                                                        {formatCurrency(balance.totalBenef)}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            ) : (
                                <Typography>Aucun bilan disponible.</Typography>
                            )}
                        </Box>
                    </Box>
                )}
            </Box>
        </Modal>
    );
    }


    export default SellerDetailModal;