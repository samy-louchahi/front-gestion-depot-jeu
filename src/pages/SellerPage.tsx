import React, { useState, useEffect } from 'react';
import SellerList from '../components/sellers/SellerList';
import { Button, Typography, Box } from '@mui/material';
import { UserGroupIcon } from '@heroicons/react/outline';
import { getSellers } from '../services/sellerService';
import { Seller } from '../types';

const SellerPage: React.FC = () => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const data = await getSellers();
        setSellers(data);
      } catch (err) {
        console.error('Erreur lors de la récupération des vendeurs :', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSellers();
  }, []);

  return (
    <Box className="p-8 space-y-6">
      <Typography variant="h4" className="text-center font-bold text-gray-800">
        Gestion des Vendeurs
      </Typography>

      {loading ? (
        <Typography className="text-center text-gray-500">
          Chargement des vendeurs...
        </Typography>
      ) : sellers.length === 0 ? (
        <Box className="flex flex-col items-center justify-center space-y-4 p-10 bg-white rounded-lg shadow-md">
          <UserGroupIcon className="w-16 h-16 text-indigo-500" />
          <Typography className="text-2xl font-semibold text-gray-800">
            Aucun vendeur trouvé
          </Typography>
          <Typography className="text-gray-600">
            Ajoutez un vendeur pour commencer à gérer ses dépôts et ventes.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<UserGroupIcon className="w-5 h-5" />}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Ajouter un vendeur
          </Button>
        </Box>
      ) : (
        <SellerList />
      )}
    </Box>
  );
};

export default SellerPage;