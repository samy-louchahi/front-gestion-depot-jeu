// src/components/stats/TopGamesTable.tsx

import React, { useEffect, useState } from 'react';
import { getTopGamesBySession, TopGame } from '../../services/statisticService';
import { formatCurrency } from '../../utils/formatCurrency';
import { Box, Typography, Table, TableHead, TableBody, TableRow, TableCell, CircularProgress } from '@mui/material';

interface TopGamesTableProps {
  sessionId?: number;
}

const TopGamesTable: React.FC<TopGamesTableProps> = ({ sessionId }) => {
  const [topGames, setTopGames] = useState<TopGame[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopGames = async () => {
      setLoading(true);
      try {
        const data = await getTopGamesBySession(sessionId? sessionId : 0);
        setTopGames(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Erreur lors de la récupération des jeux les plus vendus.');
      } finally {
        setLoading(false);
      }
    };

    fetchTopGames();
  }, [sessionId]);

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-20">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" className="text-center">
        {error}
      </Typography>
    );
  }

  if (!topGames.length) {
    return <p>Aucun jeu vendu pour cette session.</p>;
  }

  return (
    <Box>
      <Typography variant="h6" className="mb-4">
        Top 5 des jeux les plus vendus
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Nom du jeu</strong></TableCell>
            <TableCell><strong>Éditeur</strong></TableCell>
            <TableCell align="right"><strong>Quantité vendue</strong></TableCell>
            <TableCell align="right"><strong>Montant total</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {topGames.map((game, index) => (
            <TableRow key={index} className="hover:bg-gray-50">
              <TableCell>{game.gameName}</TableCell>
              <TableCell>{game.publisher}</TableCell>
              <TableCell align="right">{game.totalQuantity}</TableCell>
              <TableCell align="right">{formatCurrency(game.totalAmount)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default TopGamesTable;