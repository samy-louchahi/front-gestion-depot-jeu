import React, { useEffect, useState } from 'react';
import { getSalesCount } from '../../services/statisticService';
import { Box, CircularProgress } from '@mui/material';

interface SalesCountCardProps {
  sessionId?: number;
}

const SalesCountCard: React.FC<SalesCountCardProps> = ({ sessionId }) => {
  const [salesCount, setSalesCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSalesCount = async () => {
      if (!sessionId) return; // Pas de session => on skip
      setLoading(true);
      try {
        const count = await getSalesCount(sessionId);
        setSalesCount(count);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Impossible de récupérer le nombre de ventes.');
      } finally {
        setLoading(false);
      }
    };
    fetchSalesCount();
  }, [sessionId]);

  if (!sessionId) {
    return <p>Veuillez sélectionner une session.</p>;
  }

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-20">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <Box className="p-6 bg-white rounded-lg shadow-md border border-gray-200 text-center transition-transform transform hover:scale-105">
      <h3 className="text-lg font-semibold text-gray-700 truncate max-w-full">Nombre de ventes</h3>
      <p className="text-4xl font-bold text-indigo-600 mt-2">{salesCount}</p>
    </Box>
  );
};

export default SalesCountCard;