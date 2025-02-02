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
  IconButton,
  CardMedia,
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
  const [sellerStocks, setSellerStocks] = useState<
    { seller: Seller; initial_quantity: number; current_quantity: number }[]
  >([]);

  useEffect(() => {
    const fetchStocks = async () => {
      setLoading(true);
      try {
        const data = await getGameStocks(game.game_id);
        const aggregatedStocks = aggregateStocks(data);
        setStocks(aggregatedStocks);

        // Calcul des quantités totales du jeu
        const totalInitial: number = aggregatedStocks.reduce(
          (acc: number, stock: Stock) => acc + stock.initial_quantity,
          0
        );
        const totalCurrent: number = aggregatedStocks.reduce(
          (acc: number, stock: Stock) => acc + stock.current_quantity,
          0
        );

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
   * Agréger les stocks (personnalisez cette fonction selon vos besoins)
   */
  const aggregateStocks = (stocks: Stock[]): Stock[] => {
    // Implémentez ici votre logique d'agrégation si nécessaire
    return stocks;
  };

  /**
   * Agréger les stocks par vendeur
   */
  const aggregateSellers = (
    stocks: Stock[]
  ): { seller: Seller; initial_quantity: number; current_quantity: number }[] => {
    const sellerMap: { [key: number]: { seller: Seller; initial_quantity: number; current_quantity: number } } = {};

    stocks.forEach((stock) => {
      if (stock.Seller) {
        const sellerId = stock.seller_id!;
        if (!sellerMap[sellerId]) {
          sellerMap[sellerId] = {
            seller: stock.Seller,
            initial_quantity: 0,
            current_quantity: 0,
          };
        }
        sellerMap[sellerId].initial_quantity += stock.initial_quantity;
        sellerMap[sellerId].current_quantity += stock.current_quantity;
      }
    });

    return Object.values(sellerMap);
  };

  // Définir la source de l'image (si aucune image n'est fournie, utiliser l'image par défaut)
  const imageSrc = game.picture ? game.picture : '/affiche_FDJ_montpellier.jpg';

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="game-detail-title"
      aria-describedby="game-detail-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          p: 4,
          borderRadius: 2,
          boxShadow: 24,
          maxHeight: '90vh',
          width: '90%',
          maxWidth: 800,
          overflowY: 'auto',
        }}
      >
        {/* En-tête avec titre et bouton de fermeture */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" id="game-detail-title">
            Détails du Jeu: {game.name}
          </Typography>
          <IconButton onClick={onClose} aria-label="close" size="large">
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 2 }} />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" align="center" sx={{ mt: 4 }}>
            {error}
          </Typography>
        ) : (
          <Box sx={{ mt: 2 }}>
            {/* Affichage de l'image du jeu */}
            <CardMedia
              component="img"
              image={imageSrc}
              alt={game.name}
              onError={(e: any) => {
                e.target.onerror = null;
                e.target.src = '/affiche_FDJ_montpellier.jpg';
              }}
              sx={{
                width: '100%',
                height: 300,
                objectFit: 'cover',
                borderRadius: 2,
                mb: 3,
              }}
            />

            {/* Section Informations Générales */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 1, color: 'primary.main' }}>
                Informations Générales
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Éditeur :</strong> {game.publisher}
              </Typography>
              <Typography variant="body1">
                <strong>Description :</strong> {game.description ? game.description : 'Aucune description disponible.'}
              </Typography>
            </Box>

            {/* Section Stocks Totaux */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 1, color: 'primary.main' }}>
                Stocks Totaux
              </Typography>
              <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: 'grey.200' }}>
                      <TableCell>
                        <strong>Quantité Initiale Totale</strong>
                      </TableCell>
                      <TableCell align="right">
                        <strong>Quantité Actuelle Totale</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow sx={{ '&:hover': { backgroundColor: 'grey.100' } }}>
                      <TableCell>{totalInitialQuantity}</TableCell>
                      <TableCell align="right">{totalCurrentQuantity}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {/* Section Stocks par Vendeur */}
            {sellerStocks.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 1, color: 'primary.main' }}>
                  Stocks par Vendeur
                </Typography>
                <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: 'grey.200' }}>
                        <TableCell>
                          <strong>Vendeur</strong>
                        </TableCell>
                        <TableCell align="right">
                          <strong>Quantité Initiale</strong>
                        </TableCell>
                        <TableCell align="right">
                          <strong>Quantité Actuelle</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sellerStocks.map((sellerStock) => (
                        <TableRow
                          key={sellerStock.seller.seller_id}
                          sx={{ '&:hover': { backgroundColor: 'grey.100' } }}
                        >
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