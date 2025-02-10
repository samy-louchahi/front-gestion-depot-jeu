import React, { useEffect, useState } from 'react';
import { getVendorStats, VendorStatsResponse } from '../../services/statisticService';
import { Box, CircularProgress, Typography } from '@mui/material';
import { UserGroupIcon, StarIcon } from '@heroicons/react/solid'; // Heroicons v2

interface VendorStatsCardProps {
  sessionId?: number;
}

const VendorStatsCard: React.FC<VendorStatsCardProps> = ({ sessionId }) => {
  const [stats, setStats] = useState<VendorStatsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!sessionId) return;
      setLoading(true);
      try {
        const data = await getVendorStats(sessionId);
        setStats(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Impossible de récupérer les statistiques des vendeurs.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
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

  if (!stats) {
    return null;
  }

  return (
    <Box className="p-6 bg-white rounded-lg shadow-lg border border-gray-200 max-w-md mx-auto transition-transform transform hover:scale-105 space-y-6">
      <Typography variant="h5" className="font-bold text-gray-800 text-center">
        Statistiques des vendeurs
      </Typography>

      <div className="grid grid-cols-1 gap-6">
        {/* Vendeurs participants */}
        <Box className="flex items-center space-x-4">
          <UserGroupIcon className="w-14 h-14 text-indigo-500" />
          <div>
            <Typography className="text-lg font-bold text-gray-500">Vendeurs participants</Typography>
            <Typography className="text-3xl  text-gray-800">{stats.totalVendors}</Typography>
          </div>
        </Box>

        {/* Vendeur le plus actif */}
        <Box className="flex items-center space-x-4">
          <StarIcon className="w-14 h-14 text-yellow-500" />
          <div>
            <Typography className="text-gray-500">Vendeur le plus actif</Typography>
            <Typography className="text-2xl font-bold text-blue-600">{stats.topVendor.sellerName}</Typography>
            <Typography className="text-gray-600">
              Nombre de ses ventes : <strong>{stats.topVendor.totalSales}</strong>
            </Typography>
          </div>
        </Box>
      </div>
    </Box>
  );
};

export default VendorStatsCard;