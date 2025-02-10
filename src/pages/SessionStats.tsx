import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Session } from '../types';
import { getSessions } from '../services/sessionService';
import VendorSharesPieChart from '../components/statistics/VendorSharesPieChart';
import SalesOverTimeLineChart from '../components/statistics/SaleOverTimeChart';
import SalesCountCard from '../components/statistics/SaleCountCard';
import StocksDonutChart from '../components/statistics/StocksDonutChart';
import FinancialSummaryCards from '../components/statistics/FinancialSummaryCards';
import TopGamesTable from '../components/statistics/TopGamesTable';
import VendorStatsCard from '../components/statistics/VendorStatsCard';
import { ChartBarIcon } from '@heroicons/react/outline'; // Icône illustrative

const SessionStatsPage: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<number | ''>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        const sessionsData = await getSessions();
        setSessions(sessionsData);
        setError(null);
      } catch (err: any) {
        setError('Erreur lors de la récupération des sessions');
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const handleSessionChange = (event: any) => {
    setSelectedSession(event.target.value);
  };

  return (
    <Box className="p-8 space-y-12">
      <Typography variant="h4" className="text-center font-bold text-gray-800">
        Tableau de Bord des Statistiques
      </Typography>

      <div className="flex justify-center">
        <FormControl variant="outlined" className="w-full sm:w-1/2 md:w-1/3">
          <InputLabel id="session-select-label">Choisir une Session</InputLabel>
          <Select
            labelId="session-select-label"
            label="Choisir une Session"
            value={selectedSession}
            onChange={handleSessionChange}
          >
            <MenuItem value="">
              <em>-- Sélectionnez une session --</em>
            </MenuItem>
            {sessions.map((s) => (
              <MenuItem key={s.session_id} value={s.session_id}>
                {s.name} (du {new Date(s.start_date).toLocaleDateString()} au {new Date(s.end_date).toLocaleDateString()})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {selectedSession ? (
        <div className="space-y-12">
          {/* Section des cartes */}
            <SalesCountCard sessionId={+selectedSession} />
            <FinancialSummaryCards sessionId={+selectedSession} />
            <VendorStatsCard sessionId={+selectedSession} />
          {/* Grille des charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md">
              <VendorSharesPieChart sessionId={+selectedSession} />
            </div>
            <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md">
              <StocksDonutChart sessionId={+selectedSession} />
            </div>
          </div>

          {/* Courbe des ventes dans le temps */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <SalesOverTimeLineChart sessionId={+selectedSession} />
          </div>

          {/* Tableau des top jeux */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <TopGamesTable sessionId={+selectedSession} />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-4 p-10">
          <ChartBarIcon className="w-16 h-16 text-gray-400" />
          <Typography className="text-xl font-semibold text-gray-700">
            Veuillez sélectionner une session pour afficher les statistiques.
          </Typography>
          <Typography className="text-gray-500">
            Choisissez une session à partir du menu déroulant ci-dessus.
          </Typography>
        </div>
      )}
    </Box>
  );
};

export default SessionStatsPage;