import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  OutlinedInput,
  SelectChangeEvent,
} from '@mui/material';
import DepositGameEntryCard, { DepositGameEntry } from './DepositGameEntryCard';
import { AddCircleOutline } from '@mui/icons-material';
import { Deposit, Seller, Session, Game } from '../../types';
import { createDeposit, getActiveSessions, getSellers, getGames } from '../../services/depositService';
import { createOrUpdateStock } from '../../services/stockService';

interface AddDepositModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (deposit: Deposit) => void;
}

const AddDepositModal: React.FC<AddDepositModalProps> = ({ open, onClose, onAdd }) => {
  // Informations communes
  const [sessions, setSessions] = useState<Session[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [selectedSession, setSelectedSession] = useState<number | string>('');
  const [selectedSeller, setSelectedSeller] = useState<number | string>('');
  const [depositDate, setDepositDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [discountFees, setDiscountFees] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  // Liste des articles du dépôt
  const [depositItems, setDepositItems] = useState<DepositGameEntry[]>([]);
  const [nextItemId, setNextItemId] = useState<number>(1);

  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        try {
          const [sessionsData, sellersData, gamesData] = await Promise.all([
            getActiveSessions(),
            getSellers(),
            getGames(),
          ]);
          setSessions(sessionsData);
          setSellers(sellersData);
          setGames(gamesData);
        } catch (err) {
          console.error('Erreur lors de la récupération des données :', err);
          setError('Erreur lors de la récupération des données.');
        }
      };
      fetchData();
    }
  }, [open]);

  const handleSessionChange = (e: SelectChangeEvent<string | number>) => {
    setSelectedSession(e.target.value as number);
  };

  const handleSellerChange = (e: SelectChangeEvent<string | number>) => {
    setSelectedSeller(e.target.value as number);
  };

  // Ajouter un nouvel article vide dans le panier
  const addDepositItem = () => {
    const newItem: DepositGameEntry = {
      id: nextItemId,
      game_id: null,
      exemplaires: { "0": { price: 0, state: "neuf" } },
    };
    setDepositItems([...depositItems, newItem]);
    setNextItemId(nextItemId + 1);
  };

  // Supprimer un article du panier
  const removeDepositItem = (id: number) => {
    setDepositItems(depositItems.filter(item => item.id !== id));
  };

  // Mettre à jour un champ d'un article (game_id ou fees)
  const updateDepositItem = (
    id: number,
    field: keyof Omit<DepositGameEntry, 'id' | 'exemplaires'>,
    value: any
  ) => {
    setDepositItems(depositItems.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  // Mettre à jour un exemplaire pour un article
  const updateExemplaire = (
    id: number,
    index: number,
    field: 'price' | 'state',
    value: any
  ) => {
    setDepositItems(depositItems.map(item => {
      if (item.id === id) {
        const newExemplaires = { ...item.exemplaires, [index]: { ...item.exemplaires[index.toString()], [field]: value } };
        return { ...item, exemplaires: newExemplaires };
      }
      return item;
    }));
  };

  // Ajouter un exemplaire à un article
  const addExemplaireToItem = (id: number) => {
    setDepositItems(depositItems.map(item => {
      if (item.id === id) {
        const newIndex = Object.keys(item.exemplaires).length;
        return { ...item, exemplaires: { ...item.exemplaires, [newIndex]: { price: 0, state: "neuf" } } };
      }
      return item;
    }));
  };

  const handleSubmit = async () => {
    if (!selectedSession || !selectedSeller) {
      setError("Veuillez sélectionner une session et un vendeur.");
      return;
    }
    if (depositItems.length === 0) {
      setError("Veuillez ajouter au moins un jeu à déposer.");
      return;
    }
    for (const item of depositItems) {
      if (item.game_id === null) {
        setError("Veuillez sélectionner un jeu pour chaque article.");
        return;
      }
      if (Object.keys(item.exemplaires).length === 0) {
        setError("Chaque article doit comporter au moins un exemplaire avec état et prix.");
        return;
      }
    }
  
    const gamesData = depositItems.map(item => ({
      game_id: item.game_id as number,
      quantity: Object.keys(item.exemplaires).length,
      exemplaires: item.exemplaires,
    }));
  
    const depositData = {
      seller_id: Number(selectedSeller),
      session_id: Number(selectedSession),
      deposit_date: depositDate,
      discount_fees: discountFees,
      games: gamesData,
    };
  
    try {
      const newDeposit = await createDeposit(depositData);
      const stockPromises = gamesData.map(game =>
        createOrUpdateStock({
          session_id: depositData.session_id,
          seller_id: depositData.seller_id,
          game_id: game.game_id,
          initial_quantity: game.quantity,
          current_quantity: game.quantity,
        })
      );
      await Promise.all(stockPromises);
      onAdd(newDeposit);
      setSelectedSession('');
      setSelectedSeller('');
      setDepositItems([]);
      setDepositDate(new Date().toISOString().split('T')[0]);
      setDiscountFees(0);
      setError(null);
      onClose();
    } catch (err: any) {
      console.error("Erreur lors de la création du dépôt ou des stocks:", err);
      setError(err.response?.data?.error || "Échec de la création du dépôt ou des stocks.");
    }
  };

  const handleCloseModal = () => {
    setSelectedSession('');
    setSelectedSeller('');
    setDepositItems([]);
    setDepositDate(new Date().toISOString().split('T')[0]);
    setDiscountFees(0);
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCloseModal} fullWidth maxWidth="md">
      <DialogTitle>Créer un Dépôt</DialogTitle>
      <DialogContent dividers>
        {error && <Typography color="error" align="center">{error}</Typography>}
        <FormControl fullWidth margin="normal" variant="outlined">
          <InputLabel id="session-label">Session Active</InputLabel>
          <Select labelId="session-label" label="Session Active" value={selectedSession} onChange={handleSessionChange}>
            {sessions.filter(session => session.status).map(session => (
              <MenuItem key={session.session_id} value={session.session_id}>
                {session.name} ({new Date(session.start_date).toLocaleDateString()} - {new Date(session.end_date).toLocaleDateString()})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal" variant="outlined">
          <InputLabel id="seller-label">Vendeur</InputLabel>
          <Select labelId="seller-label" label="Vendeur" value={selectedSeller} onChange={handleSellerChange}>
            {sellers.map(seller => (
              <MenuItem key={seller.seller_id} value={seller.seller_id}>
                {seller.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Date de Dépôt"
          type="date"
          fullWidth
          margin="normal"
          value={depositDate}
          onChange={(e) => setDepositDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Réduction sur les Frais (%)"
          type="number"
          fullWidth
          margin="normal"
          value={discountFees}
          onChange={(e) => setDiscountFees(parseFloat(e.target.value))}
          inputProps={{ step: '0.01', min: '0', max: '100' }}
        />
        <Box mt={3}>
          <Typography variant="h6">Exemplaires à déposer</Typography>
          {depositItems.map(item => (
            <Box key={item.id} mt={2}>
              <DepositGameEntryCard
                entry={item}
                games={games}
                onUpdateEntry={updateDepositItem}
                onUpdateExemplaire={updateExemplaire}
                onAddExemplaire={addExemplaireToItem}
                onRemoveEntry={removeDepositItem}
              />
            </Box>
          ))}
          <Box mt={2}>
            <Button variant="contained" onClick={addDepositItem}>
              Ajouter un jeu
            </Button>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Ajouter le Dépôt
        </Button>
        <Button onClick={handleCloseModal} variant="outlined">
          Annuler
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddDepositModal;