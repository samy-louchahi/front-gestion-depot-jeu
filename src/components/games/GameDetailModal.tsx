// src/components/games/GameDetailModal.tsx

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
import { Game, Stock, Seller } from '../../types';
import { getGameStocks } from '../../services/gameService';

interface GameDetailModalProps {
    open: boolean;
    onClose: () => void;
    game: Game;
}

const GameDetailModal: React.FC<GameDetailModalProps> = ({ open, onClose, game }) => {
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [totalInitialQuantity, setTotalInitialQuantity] = useState<number>(0);
    const [totalCurrentQuantity, setTotalCurrentQuantity] = useState<number>(0);
    const [sellerStocks, setSellerStocks] = useState<{ seller: Seller; initial_quantity: number; current_quantity: number }[]>([]);

    useEffect(() => {
        const fetchStocks = async () => {
            setLoading(true);
            try {
                const data = await getGameStocks(game.game_id);
                const aggregatedStocks = aggregateStocks(data);
                setStocks(aggregatedStocks);

                // Calculer les quantités totales du jeu
                const totalInitial: number = aggregatedStocks.reduce((acc: number, stock: Stock) => acc + stock.initial_quantity, 0);
                const totalCurrent: number = aggregatedStocks.reduce((acc: number, stock: Stock) => acc + stock.current_quantity, 0);

                setTotalInitialQuantity(totalInitial);
                setTotalCurrentQuantity(totalCurrent);
                setSellerStocks(aggregateSellers(aggregatedStocks));

                setError(null);
            } catch (err: any) {
                console.error(err);
                setError('Erreur lors de la récupération des stocks du jeu.');
            } finally {
                setLoading(false);
            }
        };

        if (open) {
            fetchStocks();
        }
    }, [open, game]);

    /**
     * Agréger les stocks
     * @param stocks Liste des stocks récupérés du backend
     * @returns Liste des stocks agrégés
     */
    const aggregateStocks = (stocks: Stock[]): Stock[] => {
        // Implémentez ici la logique pour agréger les stocks
        return stocks;
    };

    /**
     * Agréger les stocks par vendeur
     * @param stocks Liste des stocks récupérés du backend
     * @returns Liste des stocks agrégés par vendeur
     */
    const aggregateSellers = (stocks: Stock[]): { seller: Seller; initial_quantity: number; current_quantity: number }[] => {
        const sellerMap: { [key: number]: { seller: Seller; initial_quantity: number; current_quantity: number } } = {};

        stocks.forEach(stock => {
            if (stock.Seller) {
                const sellerId = stock.seller_id!;
                if (!sellerMap[sellerId]) {
                    sellerMap[sellerId] = {
                        seller: stock.Seller,
                        initial_quantity: 0,
                        current_quantity: 0
                    };
                }
                sellerMap[sellerId].initial_quantity += stock.initial_quantity;
                sellerMap[sellerId].current_quantity += stock.current_quantity;
            }
        });

        return Object.values(sellerMap);
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="game-detail-title"
            aria-describedby="game-detail-description"
        >
            <Box
                className="bg-white p-6 rounded-lg w-full max-w-5xl mx-auto mt-10 overflow-auto shadow-lg"
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    maxHeight: '90vh',
                    width: '90%',
                }}
            >
                {/* Header avec Titre et Bouton de Fermeture */}
                <Box className="flex justify-between items-center mb-4">
                    <Typography variant="h5" id="game-detail-title">
                        Détails du Jeu: {game.name}
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
                                    <strong>Éditeur :</strong> {game.publisher}
                                </Typography>
                            </Box>
                        </Box>

                        {/* Stocks Totaux */}
                        <Box>
                            <Typography variant="h6" className="mb-2 text-blue-600">
                                Stocks Totaux
                            </Typography>
                            <TableContainer component={Paper} className="rounded-lg">
                                <Table>
                                    <TableHead>
                                        <TableRow className="bg-gray-100">
                                            <TableCell><strong>Quantité Initiale Totale</strong></TableCell>
                                            <TableCell align="right"><strong>Quantité Actuelle Totale</strong></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow className="hover:bg-gray-50 transition-colors duration-200">
                                            <TableCell>{totalInitialQuantity}</TableCell>
                                            <TableCell align="right">{totalCurrentQuantity}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>

                        {/* Liste des Stocks par Vendeur */}
                        {sellerStocks.length > 0 && (
                            <Box>
                                <Typography variant="h6" className="mb-2 text-blue-600">
                                    Stocks par Vendeur
                                </Typography>
                                <TableContainer component={Paper} className="rounded-lg">
                                    <Table>
                                        <TableHead>
                                            <TableRow className="bg-gray-100">
                                                <TableCell><strong>Vendeur</strong></TableCell>
                                                <TableCell align="right"><strong>Quantité Initiale</strong></TableCell>
                                                <TableCell align="right"><strong>Quantité Actuelle</strong></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {sellerStocks.map(sellerStock => (
                                                <TableRow key={sellerStock.seller.seller_id} className="hover:bg-gray-50 transition-colors duration-200">
                                                    <TableCell>{sellerStock.seller.name}</TableCell>
                                                    <TableCell align="right">{sellerStock.initial_quantity}</TableCell>
                                                    <TableCell align="right">{sellerStock.current_quantity}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        )}
                    </Box>
                )}
            </Box>
        </Modal>
    );
};

export default GameDetailModal;