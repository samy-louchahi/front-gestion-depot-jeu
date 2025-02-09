// src/components/sales/AddSaleModal.tsx

import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  TextField,
  Typography,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  ListItemText,
  OutlinedInput,
  IconButton,
  Grid,
  CircularProgress,
  Snackbar,
  Alert,
  SelectChangeEvent,
} from '@mui/material';
import { RemoveCircleOutline } from '@mui/icons-material';
import { Sale, Buyer, Session, DepositGame, Seller, Game } from '../../types';
import { createSale, getSaleById, createSaleDetail } from '../../services/saleService';
import { getSellers, getAllDepositGames, getActiveSessions } from '../../services/depositService';
import { getBuyers } from '../../services/buyerService';

interface AddSaleModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (sale: Sale) => void;
}

const AddSaleModal: React.FC<AddSaleModalProps> = ({ open, onClose, onAdd }) => {
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [depositGames, setDepositGames] = useState<DepositGame[]>([]);
  const [selectedBuyer, setSelectedBuyer] = useState<number | string>('');
  const [selectedSession, setSelectedSession] = useState<number | string>('');
  const [selectedDepositGamesIds, setSelectedDepositGamesIds] = useState<number[]>([]);
  // saleDetails enregistre pour chaque DepositGame l'objet { quantity: number } représentant
  // le nombre d'exemplaires vendus pour ce DepositGame.
  const [saleDetails, setSaleDetails] = useState<Record<number, { quantity: number }>>({});
  const [saleDate, setSaleDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [saleStatus, setSaleStatus] = useState<'en cours' | 'finalisé' | 'annulé'>('en cours');

  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        try {
          const [buyersData, sessionsData, sellersData, depositGamesData] = await Promise.all([
            getBuyers(),
            getActiveSessions(),
            getSellers(),
            getAllDepositGames(),
          ]);
          setBuyers(buyersData);
          setSessions(sessionsData);
          setSellers(sellersData);
          setDepositGames(depositGamesData);
        } catch (err) {
          console.error('Error fetching data:', err);
          setError('Erreur lors de la récupération des données.');
        }
      };
      fetchData();
    }
  }, [open]);

  const handleBuyerChange = (event: SelectChangeEvent<string | number>) => {
    setSelectedBuyer(event.target.value as number);
  };

  const handleSessionChange = (event: SelectChangeEvent<string | number>) => {
    setSelectedSession(event.target.value as number);
  };

  const handleDepositGameChange = (event: SelectChangeEvent<number[]>) => {
    const value = event.target.value as number[];
    setSelectedDepositGamesIds(value);

    // Ajout des détails pour chaque DepositGame sélectionné, si non déjà présent
    const newSaleDetails: Record<number, { quantity: number }> = { ...saleDetails };
    value.forEach((deposit_game_id) => {
      if (!newSaleDetails[deposit_game_id]) {
        newSaleDetails[deposit_game_id] = { quantity: 1 };
      }
    });
    // Supprimer les détails pour les jeux non sélectionnés
    Object.keys(newSaleDetails).forEach((key) => {
      if (!value.includes(Number(key))) {
        delete newSaleDetails[Number(key)];
      }
    });
    setSaleDetails(newSaleDetails);
  };

  const handleSaleDetailChange = (
    deposit_game_id: number,
    field: keyof { quantity: number },
    value: number
  ) => {
    setSaleDetails((prev) => ({
      ...prev,
      [deposit_game_id]: {
        ...prev[deposit_game_id],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    if (!selectedSession) {
      setError('Veuillez sélectionner une session.');
      return;
    }
    if (selectedDepositGamesIds.length === 0) {
      setError('Veuillez sélectionner au moins un jeu déposé.');
      return;
    }
    // Pour chaque DepositGame sélectionné, vérifiez que la quantité vendue ne dépasse pas la disponibilité.
    for (const deposit_game_id of selectedDepositGamesIds) {
      const detail = saleDetails[deposit_game_id];
      if (!detail || detail.quantity <= 0) {
        setError('Veuillez définir une quantité valide pour tous les jeux.');
        return;
      }
      const depositGame = depositGames.find(dg => dg.deposit_game_id === deposit_game_id);
      // La disponibilité est déterminée par le nombre d'exemplaires enregistrés dans le champ exemplaires.
      const availableQuantity = depositGame && depositGame.exemplaires
        ? Object.keys(depositGame.exemplaires).length
        : 0;
      if (depositGame && detail.quantity > availableQuantity) {
        setError(`La quantité pour le jeu "${depositGame.Game?.name}" dépasse la disponibilité (${availableQuantity}).`);
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const newSale = await createSale({
        buyer_id: selectedBuyer ? Number(selectedBuyer) : undefined,
        session_id: Number(selectedSession),
        sale_date: saleDate,
        sale_status: saleStatus,
      });

      for (const deposit_game_id of selectedDepositGamesIds) {
        await createSaleDetail({
          sale_id: newSale.sale_id!,
          deposit_game_id: deposit_game_id,
          quantity: saleDetails[deposit_game_id].quantity,
        });
      }

      const fetchedSale = await getSaleById(newSale.sale_id!);
      onAdd(fetchedSale);
      setSnackbarMessage('Vente ajoutée avec succès !');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setSelectedBuyer('');
      setSelectedSession('');
      setSelectedDepositGamesIds([]);
      setSaleDetails({});
      setSaleDate(new Date().toISOString().split('T')[0]);
      setError(null);
      onClose();
    } catch (err: any) {
      console.error('Error creating sale:', err);
      setError(err.response?.data?.error || 'Échec de la création de la vente.');
      setSnackbarMessage(err.response?.data?.error || 'Échec de la création de la vente.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedBuyer('');
    setSelectedSession('');
    setSelectedDepositGamesIds([]);
    setSaleDetails({});
    setSaleDate(new Date().toISOString().split('T')[0]);
    setError(null);
    onClose();
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Modal open={open} onClose={handleCloseModal}>
      <Box
        className="bg-white p-6 rounded-lg w-full max-w-3xl mx-auto mt-10 overflow-auto shadow-lg"
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          maxHeight: '90vh',
          width: '90%',
        }}
      >
        <Typography variant="h5" className="text-center mb-4">
          Ajouter une Vente
        </Typography>
        {error && (
          <Typography color="error" className="mb-2 text-center">
            {error}
          </Typography>
        )}
        <FormControl fullWidth variant="outlined" className="mb-4">
          <InputLabel id="buyer-label">Acheteur (Optionnel)</InputLabel>
          <Select labelId="buyer-label" label="Acheteur (Optionnel)" value={selectedBuyer} onChange={handleBuyerChange}>
            <MenuItem value="">
              <em>Aucun</em>
            </MenuItem>
            {buyers.map((buyer) => (
              <MenuItem key={buyer.buyer_id} value={buyer.buyer_id}>
                {buyer.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth variant="outlined" className="mb-4">
          <InputLabel id="session-label">Session</InputLabel>
          <Select labelId="session-label" label="Session" value={selectedSession} onChange={handleSessionChange}>
            {sessions.map((session) => (
              <MenuItem key={session.session_id} value={session.session_id}>
                {session.name} ({new Date(session.start_date).toLocaleDateString()} - {new Date(session.end_date).toLocaleDateString()})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth variant="outlined" className="mb-4">
          <InputLabel id="deposit-game-label">Jeux Déposés</InputLabel>
          <Select
            labelId="deposit-game-label"
            label="Jeux Déposés"
            multiple
            value={selectedDepositGamesIds}
            onChange={handleDepositGameChange}
            input={<OutlinedInput label="Jeux Déposés" />}
            renderValue={(selected) => {
              const selectedNames = depositGames
                .filter((dg) => dg.deposit_game_id !== undefined && selected.includes(dg.deposit_game_id))
                .map((dg) => `${dg.Game?.name} (Dépôt ID: ${dg.deposit_id})`);
              return selectedNames.join(', ');
            }}
          >
            {depositGames.map((dg) => (
              <MenuItem key={dg.deposit_game_id} value={dg.deposit_game_id}>
                <Checkbox checked={dg.deposit_game_id !== undefined && selectedDepositGamesIds.indexOf(dg.deposit_game_id) > -1} />
                <ListItemText
                  primary={`${dg.Game?.name} | Prix: €${dg.exemplaires ? Object.values(dg.exemplaires).map(e => e.price).join(', ') : ''} | Frais: ${dg.fees}% | Quantité Disponible: ${dg.exemplaires ? Object.keys(dg.exemplaires).length : 0}`}
                />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {/* Détails pour chaque jeu sélectionné */}
        {selectedDepositGamesIds.map((deposit_game_id) => {
          const dg = depositGames.find((dg) => dg.deposit_game_id === deposit_game_id);
          if (!dg) return null;
          return (
            <Box key={deposit_game_id} className="mb-4 p-2 border rounded">
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle1">{dg.Game?.name || 'Jeu Inconnu'}</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Quantité"
                    type="number"
                    variant="outlined"
                    fullWidth
                    value={saleDetails[deposit_game_id]?.quantity || 1}
                    onChange={(e) =>
                      handleSaleDetailChange(deposit_game_id, 'quantity', parseInt(e.target.value) || 1)
                    }
                    inputProps={{
                      min: '1',
                      max: dg.exemplaires ? Object.keys(dg.exemplaires).length : 0,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <IconButton
                    color="secondary"
                    onClick={() => {
                      setSelectedDepositGamesIds((prev) => prev.filter((id) => id !== deposit_game_id));
                      setSaleDetails((prev) => {
                        const newDetails = { ...prev };
                        delete newDetails[deposit_game_id];
                        return newDetails;
                      });
                    }}
                  >
                    <RemoveCircleOutline />
                  </IconButton>
                </Grid>
              </Grid>
            </Box>
          );
        })}
        <Box className="mb-4">
          <TextField
            label="Date de Vente"
            type="date"
            variant="outlined"
            fullWidth
            className="mb-4"
            value={saleDate}
            onChange={(e) => setSaleDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Box>
        <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Ajouter la Vente'}
        </Button>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Modal>
  );
};

export default AddSaleModal;