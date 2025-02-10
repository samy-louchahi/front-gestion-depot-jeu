import React, { useState, useEffect } from 'react';
import GameList from '../components/games/GameList';
import { Button, Typography, Box } from '@mui/material';
import { DocumentAddIcon, UploadIcon } from '@heroicons/react/outline';
import { getGames } from '../services/gameService';
import { Game } from '../types';

const GamePage: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const data = await getGames();
        setGames(data);
      } catch (err) {
        console.error('Erreur lors de la récupération des jeux :', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  return (
    <Box className="p-8 space-y-6">
      <Typography variant="h4" className="text-center font-bold text-gray-800">
       Gestion des Jeux
      </Typography>

      {loading ? (
        <Typography className="text-center text-gray-500">Chargement des jeux...</Typography>
      ) : games.length === 0 ? (
        <Box className="flex flex-col items-center justify-center space-y-4 p-10 bg-white rounded-lg shadow-md">
          <Typography className="text-2xl font-semibold text-gray-800">
            Aucun jeu disponible pour le moment
          </Typography>
          <Typography className="text-gray-600">
            Ajoutez vos premiers jeux en les créant manuellement ou en important un fichier CSV.
          </Typography>
          <div className="flex space-x-4 mt-4">
            <Button
              variant="contained"
              color="primary"
              startIcon={<DocumentAddIcon className="w-5 h-5" />}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Créer un nouveau jeu
            </Button>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<UploadIcon className="w-5 h-5" />}
              className="border-blue-500 text-blue-500 hover:bg-blue-100"
            >
              Importer un CSV
            </Button>
          </div>
        </Box>
      ) : (
        <GameList />
      )}
    </Box>
  );
};

export default GamePage;