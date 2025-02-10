// src/components/sales/AddSaleModal.tsx

import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Checkbox,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { RemoveCircleOutline } from '@mui/icons-material';
import { Buyer, Seller, Session, DepositGame, Deposit, Sale } from '../../types';
import {
  getSellers,
  getAllDeposits,
  getAllDepositGames,
  getActiveSessions
} from '../../services/depositService';
import { createSale, getSaleById, createSaleDetail } from '../../services/saleService';
import { getBuyers } from '../../services/buyerService';

interface AddSaleModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (sale: Sale) => void;
}

/**
 * AddSaleModal (version "Wizard" en 3 étapes) :
 *  Étape 1 : Choix Session (active), Vendeur (ayant fait au moins un dépôt), Acheteur (optionnel)
 *  Étape 2 : Liste des DepositGames (session + vendeur + exemplaires>0), sélection & quantités
 *  Étape 3 : Récap, confirmation & validation
 */
const AddSaleModal: React.FC<AddSaleModalProps> = ({ open, onClose, onAdd }) => {
  // ----- ÉTATS -----
  // Étape actuelle (1, 2 ou 3)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Données récupérées
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [depositGames, setDepositGames] = useState<DepositGame[]>([]);

  // Sélections Wizard
  const [selectedBuyer, setSelectedBuyer] = useState<number | ''>('');
  const [selectedSeller, setSelectedSeller] = useState<number | ''>('');
  const [selectedSession, setSelectedSession] = useState<number | ''>('');

  // Étape 2 : liste des jeux sélectionnés, avec la quantité
  interface ChosenGame {
    deposit_game_id: number;
    quantity: number;
  }
  const [chosenGames, setChosenGames] = useState<ChosenGame[]>([]);

  // Informations de la vente
  const [saleDate, setSaleDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [saleStatus, setSaleStatus] = useState<'en cours' | 'finalisé' | 'annulé'>('en cours');

  // Erreurs, chargement, notifications
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  // ----- CHARGEMENT DES DONNÉES -----
  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        try {
          // Récupérer :
          //  1) Acheteurs
          //  2) Vendeurs
          //  3) Sessions actives
          //  4) Tous les dépôts
          //  5) Tous les DepositGames
          const [
            buyersData,
            sellersData,
            sessionsData,
            depositsData,
            depositGamesData
          ] = await Promise.all([
            getBuyers(),
            getSellers(),
            getActiveSessions(), // renvoie déjà les sessions "actives" (status=true)
            getAllDeposits(),
            getAllDepositGames(),
          ]);
          setBuyers(buyersData);
          setSellers(sellersData);
          const activeSessions = sessionsData.filter((s) => s.status);
          setSessions(activeSessions);  // Sessions actives
          setDeposits(depositsData);
          setDepositGames(depositGamesData);
        } catch (err) {
          console.error('Error fetching data:', err);
          setError('Erreur lors de la récupération des données.');
        }
      };
      fetchData();
      // Réinitialiser l'état du Wizard
      setCurrentStep(1);
      setSelectedBuyer('');
      setSelectedSeller('');
      setSelectedSession('');
      setChosenGames([]);
      setSaleDate(new Date().toISOString().split('T')[0]);
      setSaleStatus('en cours');
      setError(null);
    }
  }, [open]);

  // Fermeture du wizard
  const handleClose = () => {
    setCurrentStep(1);
    onClose();
  };

  // Fermeture du Snackbar
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // ----- ÉTAPE 1 -----
  // Filtrer les vendeurs qui ont fait des dépôts dans la session sélectionnée
  const selectedSessionDeposits = deposits.filter(
    (dep) => dep.session_id === (selectedSession ? Number(selectedSession) : -1)
  );
  // En tirer la liste des seller_id
  const sellersWithDepositInSession = new Set(
    selectedSessionDeposits.map((dep) => dep.seller_id)
  );
  // Filtrer la liste globale des sellers
  const filteredSellers = sellers.filter((s) =>
    sellersWithDepositInSession.has(s.seller_id)
  );

  const Step1 = () => (
    <div className="space-y-4">
      <Typography variant="h6" className="text-center font-semibold mb-4">
        Étape 1 : Choisir la Session (active), Vendeur (ayant fait un dépôt) et l’Acheteur (optionnel)
      </Typography>

      {error && (
        <Typography color="error" className="text-center">
          {error}
        </Typography>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Sélection Session (active) */}
        <FormControl variant="outlined" className="w-full">
          <InputLabel id="session-select-label">Session (active)</InputLabel>
          <Select
            labelId="session-select-label"
            label="Session (active)"
            value={selectedSession}
            onChange={(e) => {
              // Changer de session => reset seller
              setSelectedSeller('');
              setSelectedSession(e.target.value as number);
            }}
          >
            <MenuItem value="">
              <em>-- Sélectionner --</em>
            </MenuItem>
            {sessions.map((s) => (
              <MenuItem key={s.session_id} value={s.session_id}>
                {s.name} (du {new Date(s.start_date).toLocaleDateString()} au{' '}
                {new Date(s.end_date).toLocaleDateString()})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Sélection Vendeur */}
        <FormControl variant="outlined" className="w-full">
          <InputLabel id="seller-select-label">Vendeur</InputLabel>
          <Select
            labelId="seller-select-label"
            label="Vendeur"
            value={selectedSeller}
            onChange={(e) => setSelectedSeller(e.target.value as number)}
            disabled={!selectedSession} // Bloquer si pas de session choisie
          >
            <MenuItem value="">
              <em>-- Sélectionner --</em>
            </MenuItem>
            {filteredSellers.map((s) => (
              <MenuItem key={s.seller_id} value={s.seller_id}>
                {s.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {/* Acheteur (optionnel) */}
      <FormControl variant="outlined" className="w-full mt-4">
        <InputLabel id="buyer-select-label">Acheteur (Optionnel)</InputLabel>
        <Select
          labelId="buyer-select-label"
          label="Acheteur (Optionnel)"
          value={selectedBuyer}
          onChange={(e) => setSelectedBuyer(e.target.value as number)}
        >
          <MenuItem value="">
            <em>Aucun</em>
          </MenuItem>
          {buyers.map((b) => (
            <MenuItem key={b.buyer_id} value={b.buyer_id}>
              {b.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <div className="flex justify-end mt-4">
        <Button
          variant="contained"
          color="primary"
          disabled={!selectedSession || !selectedSeller}
          onClick={() => setCurrentStep(2)}
        >
          Étape Suivante
        </Button>
      </div>
    </div>
  );

  // ----- ÉTAPE 2 -----
  // Construire map deposit -> seller_id + session_id
  const depositIdToSellerId: Record<number, number> = {};
  const depositIdToSessionId: Record<number, number> = {};

  deposits.forEach((dep) => {
    depositIdToSellerId[dep.deposit_id!] = dep.seller_id;
    depositIdToSessionId[dep.deposit_id!] = dep.session_id;
  });

  // Filtrer les DepositGames selon la session et le vendeur
  const step2FilteredGames = depositGames.filter((dg) => {
    if (!selectedSession || !selectedSeller) return false;

    // Récupérer le deposit
    const sId = depositIdToSellerId[dg.deposit_id];
    const sessId = depositIdToSessionId[dg.deposit_id];
    if (sId !== Number(selectedSeller)) return false;
    if (sessId !== Number(selectedSession)) return false;

    // Vérifier exemplaires > 0
    const count = dg.exemplaires ? Object.keys(dg.exemplaires).length : 0;
    return count > 0;
  });

  // Vérifier si un depositGame est sélectionné
  const isGameSelected = (dgId: number) =>
    chosenGames.some((item) => item.deposit_game_id === dgId);

  // Récupérer la quantité vendue associée à un depositGame
  const getQuantityForGame = (dgId: number) => {
    const found = chosenGames.find((item) => item.deposit_game_id === dgId);
    return found ? found.quantity : 0;
  };

  // Ajouter / retirer un depositGame de chosenGames
  const toggleSelectGame = (dgId: number) => {
    setChosenGames((prev) => {
      const idx = prev.findIndex((x) => x.deposit_game_id === dgId);
      if (idx >= 0) {
        // Retirer
        return prev.filter((x) => x.deposit_game_id !== dgId);
      }
      // Ajouter
      return [...prev, { deposit_game_id: dgId, quantity: 1 }];
    });
  };

  // Mettre à jour la quantité
  const updateGameQuantity = (dgId: number, qty: number) => {
    setChosenGames((prev) =>
      prev.map((item) =>
        item.deposit_game_id === dgId ? { ...item, quantity: qty } : item
      )
    );
  };

  const Step2 = () => (
    <div className="space-y-4">
      <Typography variant="h6" className="text-center font-semibold mb-4">
        Étape 2 : Sélectionner les Jeux et Saisir les Quantités
      </Typography>
      {error && (
        <Typography color="error" className="text-center">
          {error}
        </Typography>
      )}

      <Box className="border border-gray-300 rounded-md overflow-auto">
        <Table size="small">
          <TableHead className="bg-gray-100">
            <TableRow>
              <TableCell />
              <TableCell>Nom du Jeu</TableCell>
              <TableCell>Frais (%)</TableCell>
              <TableCell>Quantité Dispo</TableCell>
              <TableCell>Quantité à Vendre</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {step2FilteredGames.map((dg) => {
              const exemplairesCount = dg.exemplaires
                ? Object.keys(dg.exemplaires).length
                : 0;
              const selected = isGameSelected(dg.deposit_game_id!);
              const qty = getQuantityForGame(dg.deposit_game_id!);

              return (
                <TableRow key={dg.deposit_game_id} className="hover:bg-gray-50">
                  <TableCell>
                    <Checkbox
                      checked={selected}
                      onChange={() => toggleSelectGame(dg.deposit_game_id!)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold">{dg.Game?.name}</div>
                    <div className="text-xs text-gray-400">Dépôt ID: {dg.deposit_id}</div>
                  </TableCell>
                  <TableCell>{dg.fees}%</TableCell>
                  <TableCell>{exemplairesCount}</TableCell>
                  <TableCell>
                    {selected ? (
                      <TextField
                        type="number"
                        size="small"
                        value={qty || 1}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 1;
                          if (val > exemplairesCount) return; 
                          updateGameQuantity(dg.deposit_game_id!, val);
                        }}
                        inputProps={{
                          min: 1,
                          max: exemplairesCount,
                        }}
                      />
                    ) : (
                      <span className="text-sm text-gray-300">N/A</span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>

      <div className="flex justify-end mt-4 gap-2">
        <Button variant="outlined" onClick={() => setCurrentStep(1)}>
          Retour
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={chosenGames.length === 0}
          onClick={() => setCurrentStep(3)}
        >
          Étape Suivante
        </Button>
      </div>
    </div>
  );

  // ----- ÉTAPE 3 -----
  // Récap final
  const Step3 = () => {
    // Construire la liste de récap
    const recapList = chosenGames.map((item) => {
      const dg = depositGames.find((g) => g.deposit_game_id === item.deposit_game_id);
      const exemplairesCount = dg?.exemplaires
        ? Object.keys(dg.exemplaires).length
        : 0;
      return {
        deposit_game_id: item.deposit_game_id,
        name: dg?.Game?.name || 'N/A',
        fees: dg?.fees ?? 0,
        available: exemplairesCount,
        quantity: item.quantity,
      };
    });

    const finalizeSale = async () => {
      if (!selectedSession || !selectedSeller) {
        setError('Session ou Vendeur manquant.');
        return;
      }
      if (chosenGames.length === 0) {
        setError('Aucun jeu sélectionné.');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // 1. Créer la vente
        const newSale = await createSale({
          buyer_id: selectedBuyer ? Number(selectedBuyer) : undefined,
          session_id: Number(selectedSession),
          sale_date: saleDate,
          sale_status: saleStatus,
        });

        // 2. Créer SaleDetail pour chaque jeu sélectionné
        for (const item of chosenGames) {
          await createSaleDetail({
            sale_id: newSale.sale_id!,
            deposit_game_id: item.deposit_game_id,
            quantity: item.quantity,
          });
        }

        // 3. Récupérer la vente complète
        const fetchedSale = await getSaleById(newSale.sale_id!);
        onAdd(fetchedSale);

        // Notification succès
        setSnackbarMessage('Vente ajoutée avec succès !');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);

        // Reset
        setCurrentStep(1);
        onClose();
      } catch (err: any) {
        console.error('Error finalizing sale:', err);
        setError(err.response?.data?.error || 'Erreur lors de la création de la vente.');
        setSnackbarMessage(err.response?.data?.error || 'Erreur lors de la création de la vente.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="space-y-4">
        <Typography variant="h6" className="text-center font-semibold mb-4">
          Étape 3 : Récapitulatif et Confirmation
        </Typography>
        {error && (
          <Typography color="error" className="text-center">
            {error}
          </Typography>
        )}

        <div className="bg-gray-100 p-2 rounded text-sm text-gray-600">
          Vendeur ID: {selectedSeller} | Session ID: {selectedSession} |{' '}
          {selectedBuyer ? `Acheteur ID: ${selectedBuyer}` : `Pas d’acheteur choisi`}
          <br />
          Date de Vente : {saleDate} | Statut : {saleStatus}
        </div>

        <Box className="border border-gray-300 rounded-md overflow-auto">
          <Table size="small">
            <TableHead className="bg-gray-100">
              <TableRow>
                <TableCell>Jeu</TableCell>
                <TableCell>Frais (%)</TableCell>
                <TableCell>Qte Dispo</TableCell>
                <TableCell>Qte Vendue</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {recapList.map((r) => (
                <TableRow key={r.deposit_game_id} className="hover:bg-gray-50">
                  <TableCell>{r.name}</TableCell>
                  <TableCell>{r.fees}</TableCell>
                  <TableCell>{r.available}</TableCell>
                  <TableCell>{r.quantity}</TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => {
                        // Permet de supprimer un jeu du récap
                        setChosenGames((prev) =>
                          prev.filter((c) => c.deposit_game_id !== r.deposit_game_id)
                        );
                      }}
                    >
                      <RemoveCircleOutline />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>

        <div className="flex justify-end mt-4 gap-2">
          <Button variant="outlined" onClick={() => setCurrentStep(2)}>
            Retour
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={recapList.length === 0 || loading}
            onClick={finalizeSale}
          >
            {loading ? <CircularProgress size={20} /> : 'Valider la Vente'}
          </Button>
        </div>
      </div>
    );
  };

  // Rendu final selon currentStep
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1 />;
      case 2:
        return <Step2 />;
      case 3:
        return <Step3 />;
      default:
        return <Step1 />;
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        className="bg-white p-6 rounded-lg w-full max-w-4xl mx-auto mt-10 shadow-lg space-y-6"
        sx={{
          position: 'absolute' as 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          maxHeight: '90vh',
        }}
      >
        {renderStep()}

        {/* Snackbar */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity={snackbarSeverity}
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Modal>
  );
};

export default AddSaleModal;