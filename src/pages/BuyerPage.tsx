import React, { useState, useEffect } from 'react';
import BuyerList from '../components/buyers/BuyerList';
import { Button, Typography, Box } from '@mui/material';
import { DocumentAddIcon, UploadIcon } from '@heroicons/react/outline';
import { getBuyers } from '../services/buyerService';
import { Buyer } from '../types';

const BuyerPage: React.FC = () => {
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBuyers = async () => {
      try {
        const data = await getBuyers();
        setBuyers(data);
      } catch (err) {
        console.error('Erreur lors de la récupération des acheteurs :', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBuyers();
  }, []);

  return (
    <Box className="p-8 space-y-6">
      <Typography variant="h4" className="text-center font-bold text-gray-800">
        Gestion des Acheteurs
      </Typography>

      {loading ? (
        <Typography className="text-center text-gray-500">Chargement des acheteurs...</Typography>
      ) : buyers.length === 0 ? (
        <Box className="flex flex-col items-center justify-center space-y-4 p-10 bg-white rounded-lg shadow-md">
          <Typography className="text-2xl font-semibold text-gray-800">
            Aucun acheteur enregistré
          </Typography>
          <Typography className="text-gray-600">
            Ajoutez vos premiers acheteurs en les créant manuellement ou en important un fichier CSV.
          </Typography>
          <div className="flex space-x-4 mt-4">
            <Button
              variant="contained"
              color="primary"
              startIcon={<DocumentAddIcon className="w-5 h-5" />}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Ajouter un acheteur
            </Button>
          </div>
        </Box>
      ) : (
        <BuyerList />
      )}
    </Box>
  );
};

export default BuyerPage;