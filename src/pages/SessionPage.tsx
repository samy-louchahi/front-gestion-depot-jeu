import React, { useState, useEffect } from 'react';
import SessionList from '../components/session/SessionList';
import { Button, Typography, Box } from '@mui/material';
import { CalendarIcon } from '@heroicons/react/outline';
import { getSessions } from '../services/sessionService';
import { Session } from '../types';

const SessionPage: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const data = await getSessions();
        setSessions(data);
      } catch (err) {
        console.error('Erreur lors de la récupération des sessions :', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  return (
    <Box className="p-8 space-y-6">
      <Typography variant="h4" className="text-center font-bold text-gray-800">
        Gestion des Sessions de Dépôt-Vente
      </Typography>

      {loading ? (
        <Typography className="text-center text-gray-500">
          Chargement des sessions...
        </Typography>
      ) : sessions.length === 0 ? (
        <Box className="flex flex-col items-center justify-center space-y-4 p-10 bg-white rounded-lg shadow-md">
          <CalendarIcon className="w-16 h-16 text-indigo-500" />
          <Typography className="text-2xl font-semibold text-gray-800">
            Aucune session active
          </Typography>
          <Typography className="text-gray-600">
            Commencez une nouvelle session de dépôt-vente pour gérer les jeux, les vendeurs et les ventes.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<CalendarIcon className="w-5 h-5" />}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Créer une nouvelle session
          </Button>
        </Box>
      ) : (
        <SessionList />
      )}
    </Box>
  );
};

export default SessionPage;