import React, { useEffect, useState } from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import StockSummaryCards from '../components/stocks/StockSummaryCards';
import StockTable from '../components/stocks/StockTable';
import { getSessions } from '../services/sessionService';
import { getAllStocks } from '../services/stockService';
import { Session, Stock } from '../types';
import { ClipboardListIcon } from '@heroicons/react/outline'; 

const StockPage: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<number | undefined>(undefined);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Charger les sessions disponibles
    const fetchSessions = async () => {
      try {
        const data = await getSessions();
        setSessions(data);
      } catch (err) {
        console.error(err);
        setError('Erreur lors de la récupération des sessions.');
      }
    };

    fetchSessions();
  }, []);

  useEffect(() => {
    // Charger les stocks en fonction de la session sélectionnée
    const fetchStocks = async () => {
      setLoading(true);
      try {
        const data = await getAllStocks(selectedSession);
        setStocks(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Erreur lors de la récupération des stocks.');
      } finally {
        setLoading(false);
      }
    };

    if (selectedSession) fetchStocks();
  }, [selectedSession]);

  const handleSessionChange = (event: any) => {
    const value = event.target.value;
    setSelectedSession(value === '' ? undefined : value);
  };

  return (
    <Box className="p-8 space-y-8">
      <Typography variant="h4" className="font-bold text-center text-gray-800">
        Gestion des Stocks
      </Typography>

      {/* Sélecteur de session */}
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
        loading ? (
          <Box className="flex justify-center items-center h-20">
            <Typography className="text-gray-500">Chargement des stocks...</Typography>
          </Box>
        ) : error ? (
          <Typography color="error" className="text-center">
            {error}
          </Typography>
        ) : (
          <>
            {/* Résumé des stocks */}
            <StockSummaryCards stocks={stocks} />

            {/* Tableau des stocks */}
            <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
              <StockTable stocks={stocks} />
            </div>
          </>
        )
      ) : (
        <Box className="flex flex-col items-center justify-center space-y-4 p-10">
          <ClipboardListIcon className="w-16 h-16 text-gray-400" />
          <Typography className="text-xl font-semibold text-gray-700">
            Veuillez sélectionner une session pour afficher les stocks.
          </Typography>
          <Typography className="text-gray-500">
            Choisissez une session à partir du menu déroulant ci-dessus.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default StockPage;