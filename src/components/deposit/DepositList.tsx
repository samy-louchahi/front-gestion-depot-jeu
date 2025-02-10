import React, { useEffect, useState } from 'react';
import {
  Button,
  Typography,
  Box,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  TextField
} from '@mui/material';
import DepositCard from './DepositCard';
import AddDepositModal from './AddDepositModal';
import { Deposit, Session, Seller } from '../../types';
import {
  getAllDeposits,
  deleteDeposit
} from '../../services/depositService';
import { getSessions } from '../../services/sessionService';
import { getSellers } from '../../services/sellerService';

const DepositList: React.FC = () => {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [filteredDeposits, setFilteredDeposits] = useState<Deposit[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [selectedSession, setSelectedSession] = useState<number | 'all'>('all');
  const [selectedSeller, setSelectedSeller] = useState<number | 'all'>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openAdd, setOpenAdd] = useState<boolean>(false);
  const [searchTag, setSearchTag] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [depositsData, sessionsData, sellersData] = await Promise.all([
          getAllDeposits(),
          getSessions(),
          getSellers()
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

  // Appliquer les filtres combinés
  const applyFilter = () => {
    let result = [...deposits];

    if (selectedSession !== 'all') {
      result = result.filter(dep => dep.session_id === selectedSession);
    }
    if (selectedSeller !== 'all') {
      result = result.filter(dep => dep.seller_id === selectedSeller);
    }
    if (searchTag.trim()) {
      result = result.filter(dep => dep.tag?.toLowerCase().includes(searchTag.toLowerCase()));
    }

    setFilteredDeposits(result);
  };

  const handleSessionChange = (sessionId: number | 'all') => {
    setSelectedSession(sessionId);
    applyFilter();
  };

  const handleSellerChange = (sellerId: number | 'all') => {
    setSelectedSeller(sellerId);
    applyFilter();
  };

  const handleSearchTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTag(e.target.value);
    applyFilter();
  };

  const handleAddDeposit = (newDeposit: Deposit) => {
    setDeposits(prev => [...prev, newDeposit]);
    applyFilter(); // Réapplique les filtres pour voir si le nouveau dépôt est affiché
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

      {/* Recherche par étiquette */}
      <Box className="flex justify-center space-x-4 mb-4">
        <TextField
          label="Rechercher par étiquette"
          value={searchTag}
          onChange={handleSearchTagChange}
        />
      </Box>

      {/* Sélecteur de session */}
      <FormControl fullWidth className="mb-4">
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
      <FormControl fullWidth className="mb-4">
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
            Aucun dépôt correspondant trouvé.
          </Typography>
        )}
      </Box>

      <AddDepositModal open={openAdd} onClose={() => setOpenAdd(false)} onAdd={handleAddDeposit} />
    </Box>
  );
};

export default DepositList;