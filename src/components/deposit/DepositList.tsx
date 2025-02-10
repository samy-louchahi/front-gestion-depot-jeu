// src/components/deposits/DepositList.tsx

import React, { useEffect, useState } from 'react';
import {
  Button,
  Typography,
  Box,
  FormControl,
  Select,
  MenuItem,
  InputLabel
} from '@mui/material';
import DepositCard from './DepositCard';
import AddDepositModal from './AddDepositModal';
import { Deposit, Session, Seller } from '../../types';
import {
  getAllDeposits,
  deleteDeposit
} from '../../services/depositService';
import { getSessions } from '../../services/sessionService';
import { getSellers } from '../../services/sellerService';  // <-- NOUVEAU (ou via depositService si c’est là-bas)

const DepositList: React.FC = () => {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [filteredDeposits, setFilteredDeposits] = useState<Deposit[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]); // <-- NOUVEAU
  const [selectedSession, setSelectedSession] = useState<number | 'all'>('all');
  const [selectedSeller, setSelectedSeller] = useState<number | 'all'>('all'); // <-- NOUVEAU
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openAdd, setOpenAdd] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [depositsData, sessionsData, sellersData] = await Promise.all([
          getAllDeposits(),
          getSessions(),
          getSellers() // <-- NOUVEAU
        ]);
        setDeposits(depositsData);
        setSessions(sessionsData);
        setSellers(sellersData);
        setFilteredDeposits(depositsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Erreur lors de la récupération des données.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fonction de filtrage commune : combine session + vendeur
  const applyFilter = (
    sessionId: number | 'all',
    sellerId: number | 'all'
  ) => {
    let result = [...deposits]; // copie initiale de tous les dépôts

    if (sessionId !== 'all') {
      result = result.filter(dep => dep.session_id === sessionId);
    }
    if (sellerId !== 'all') {
      result = result.filter(dep => dep.seller_id === sellerId);
    }

    setFilteredDeposits(result);
  };

  const handleSessionChange = (sessionId: number | 'all') => {
    setSelectedSession(sessionId);
    // On applique le filtre
    applyFilter(sessionId, selectedSeller);
  };

  // Nouveau : handleSellerChange
  const handleSellerChange = (sellerId: number | 'all') => {
    setSelectedSeller(sellerId);
    // On applique le filtre
    applyFilter(selectedSession, sellerId);
  };

  // Quand on ajoute un nouveau dépôt
  const handleAddDeposit = (newDeposit: Deposit) => {
    setDeposits(prev => [...prev, newDeposit]);
    // Vérifier s’il correspond aux filtres en cours
    if (
      (selectedSession === 'all' || newDeposit.session_id === selectedSession) &&
      (selectedSeller === 'all' || newDeposit.seller_id === selectedSeller)
    ) {
      setFilteredDeposits(prev => [...prev, newDeposit]);
    }
  };

  if (loading) {
    return <Typography className="text-center mt-10">Chargement...</Typography>;
  }

  return (
    <Box className="container mx-auto p-6 space-y-8">
      {/* En-tête */}
      <Box className="flex justify-between items-center mb-6">
        <Typography variant="h4" className="font-bold text-gray-800">
          Liste des Dépôts
        </Typography>
        <Button variant="contained" color="primary" onClick={() => setOpenAdd(true)}>
          + Nouveau Dépôt
        </Button>
      </Box>

      {/* Sélecteur de session */}
      <FormControl fullWidth className="mb-6">
        <InputLabel id="session-select-label">Filtrer par Session</InputLabel>
        <Select
          labelId="session-select-label"
          label="Filtrer par Session"
          value={selectedSession}
          onChange={(e) => handleSessionChange(e.target.value as number | 'all')}
        >
          <MenuItem value="all">Toutes les Sessions</MenuItem>
          {sessions.map(session => (
            <MenuItem key={session.session_id} value={session.session_id}>
              {session.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Sélecteur de vendeur */}
      <FormControl fullWidth className="mb-6">
        <InputLabel id="seller-select-label">Filtrer par Vendeur</InputLabel>
        <Select
          labelId="seller-select-label"
          label="Filtrer par Vendeur"
          value={selectedSeller}
          onChange={(e) => handleSellerChange(e.target.value as number | 'all')}
        >
          <MenuItem value="all">Tous les Vendeurs</MenuItem>
          {sellers.map(seller => (
            <MenuItem key={seller.seller_id} value={seller.seller_id}>
              {seller.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {error && (
        <Typography className="text-center mb-4 text-red-500">
          {error}
        </Typography>
      )}

      {/* Liste des dépôts filtrés */}
      <Box className="grid grid-cols-1 gap-8">
        {filteredDeposits.length > 0 ? (
          filteredDeposits.map(deposit => (
            <DepositCard
              key={deposit.deposit_id}
              deposit={deposit}
              onDelete={() => {}}
              onUpdate={() => {}}
            />
          ))
        ) : (
          <Typography className="text-center" variant="h6">
            Aucun dépôt disponible.
          </Typography>
        )}
      </Box>

      <AddDepositModal open={openAdd} onClose={() => setOpenAdd(false)} onAdd={handleAddDeposit} />
    </Box>
  );
};

export default DepositList;