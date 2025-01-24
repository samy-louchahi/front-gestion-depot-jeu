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
    SelectChangeEvent,
    Alert
} from '@mui/material';
import { RemoveCircleOutline } from '@mui/icons-material';
import { Sale, Buyer, Session, DepositGame, Seller, Game } from '../../types';
import { createSale, getSaleById } from '../../services/saleService';
import { getSellers, getAllDepositGames, getActiveSessions } from '../../services/depositService';
import { getBuyers } from '../../services/buyerService';
import { createSaleDetail } from '../../services/saleService';

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

        // Ajouter des détails pour les nouveaux jeux sélectionnés
        const newSaleDetails: Record<number, { quantity: number }> = { ...saleDetails };
        value.forEach((deposit_game_id) => {
            if (!newSaleDetails[deposit_game_id]) {
                newSaleDetails[deposit_game_id] = { quantity: 1 };
            }
        });

        // Supprimer les détails des jeux qui ne sont plus sélectionnés
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
        // Validation
        if (!selectedSession) {
            setError('Veuillez sélectionner une session.');
            return;
        }

        if (selectedDepositGamesIds.length === 0) {
            setError('Veuillez sélectionner au moins un jeu déposé.');
            return;
        }

        // Vérifier que tous les jeux ont une quantité valide
        for (const deposit_game_id of selectedDepositGamesIds) {
            const detail = saleDetails[deposit_game_id];
            if (!detail || detail.quantity <= 0) {
                setError('Veuillez définir une quantité valide pour tous les jeux.');
                return;
            }

            // Vérifier la disponibilité
            const depositGame = depositGames.find(dg => dg.deposit_game_id === deposit_game_id);
            if (depositGame && detail.quantity > depositGame.quantity) {
                setError(`La quantité pour le jeu "${depositGame.Game?.name}" dépasse la disponibilité (${depositGame.quantity}).`);
                return;
            }
        }

        setLoading(true);
        setError(null);

        try {
            // Créer la vente
            const newSale = await createSale({
                buyer_id: selectedBuyer ? Number(selectedBuyer) : undefined,
                session_id: Number(selectedSession),
                sale_date: saleDate,
                sale_status: saleStatus,
            });

            // Créer les détails de vente
            for (const deposit_game_id of selectedDepositGamesIds) {
                await createSaleDetail({
                    sale_id: newSale.sale_id!,
                    deposit_game_id: deposit_game_id,
                    quantity: saleDetails[deposit_game_id].quantity,
                });
            }

            // Récupérer la vente complète avec les associations
            const fetchedSale = await getSaleById(newSale.sale_id!);
            onAdd(fetchedSale);

            // Afficher une notification de succès
            setSnackbarMessage('Vente ajoutée avec succès !');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);

            // Réinitialiser le formulaire
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
        // Réinitialiser le formulaire lors de la fermeture
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
                    position: 'absolute' as 'absolute',
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
                    <Select
                        labelId="buyer-label"
                        label="Acheteur (Optionnel)"
                        value={selectedBuyer}
                        onChange={handleBuyerChange}
                    >
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
                    <Select
                        labelId="session-label"
                        label="Session"
                        value={selectedSession}
                        onChange={handleSessionChange}
                    >
                        {sessions.map((session) => (
                            <MenuItem key={session.session_id} value={session.session_id}>
                                {session.name} ({new Date(session.start_date).toLocaleDateString()} -{' '}
                                {new Date(session.end_date).toLocaleDateString()})
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
                                    primary={`${dg.Game?.name} | Prix: €${dg.price} | Frais: ${dg.fees}% | Quantité Disponible: ${dg.quantity}`}
                                />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth variant="outlined" className="mb-4">
                    <InputLabel id="sale-status-label">Statut de la Vente</InputLabel>
                    <Select
                        labelId="sale-status-label"
                        label="Statut de la Vente"
                        value={saleStatus}
                        onChange={(e) => setSaleStatus(e.target.value as 'en cours' | 'finalisé' | 'annulé')}
                    >
                    <MenuItem value="en cours">En Cours</MenuItem>
                    <MenuItem value="finalisé">Finalisé</MenuItem>
                    <MenuItem value="annulé">Annulé</MenuItem>
                    </Select>
                </FormControl>

                {/* Afficher les détails des jeux sélectionnés */}
                {selectedDepositGamesIds.map((deposit_game_id) => {
                    const dg = depositGames.find((dg) => dg.deposit_game_id === deposit_game_id);
                    if (!dg) return null;
                    return (
                        <Box key={deposit_game_id} className="mb-4 p-2 border rounded">
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} sm={4}>
                                    <Typography variant="subtitle1">
                                        {dg.Game?.name || 'Jeu Inconnu'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        label="Quantité"
                                        type="number"
                                        variant="outlined"
                                        fullWidth
                                        value={saleDetails[deposit_game_id]?.quantity || 1}
                                        onChange={(e) =>
                                            handleSaleDetailChange(
                                                deposit_game_id,
                                                'quantity',
                                                parseInt(e.target.value) || 1
                                            )
                                        }
                                        inputProps={{
                                            min: '1',
                                            max: dg.quantity, // Limiter la quantité à la disponibilité
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <IconButton
                                        color="secondary"
                                        onClick={() => {
                                            setSelectedDepositGamesIds((prev) =>
                                                prev.filter((id) => id !== deposit_game_id)
                                            );
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
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Box>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    fullWidth
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : 'Ajouter la Vente'}
                </Button>

                {/* Snackbar pour les notifications */}
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