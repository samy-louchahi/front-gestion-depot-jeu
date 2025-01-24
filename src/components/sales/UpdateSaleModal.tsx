// src/components/sales/UpdateSaleModal.tsx

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
import { Sale, Buyer, Session, DepositGame, SalesOperation, Game, Seller } from '../../types';
import { updateSale, getSaleById, updateSalesOperation } from '../../services/saleService';
import { getSellers } from '../../services/sellerService';
import { getGames, getActiveSessions } from '../../services/depositService';
import { getBuyers } from '../../services/buyerService';

interface UpdateSaleModalProps {
    open: boolean;
    onClose: () => void;
    sale: Sale;
    onUpdate: (sale: Sale) => void;
}

const UpdateSaleModal: React.FC<UpdateSaleModalProps> = ({ open, onClose, sale, onUpdate }) => {
    const [buyers, setBuyers] = useState<Buyer[]>([]);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [sellers, setSellers] = useState<Seller[]>([]);
    const [games, setGames] = useState<Game[]>([]);
    const [selectedBuyer, setSelectedBuyer] = useState<number | string>(sale.buyer_id || '');
    const [selectedSession, setSelectedSession] = useState<number | string>(sale.session_id);
    const [selectedDepositGames, setSelectedDepositGames] = useState<number[]>(sale.SaleDetails?.map(detail => detail.deposit_game_id) || []);
    const [saleDetails, setSaleDetails] = useState<Record<number, { quantity: number }>>({});
    const [saleDate, setSaleDate] = useState<string>(sale.sale_date.split('T')[0]);
    const [saleStatus, setSaleStatus] = useState<'en cours' | 'finalisé' | 'annulé'>(sale.sale_status || 'en cours');
    const [commission, setCommission] = useState<number>(sale.SalesOperation?.commission || 0);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    useEffect(() => {
        if (open) {
            const fetchData = async () => {
                try {
                    const [buyers, sessionsData, sellersData, gamesData] = await Promise.all([
                        getBuyers(),
                        getActiveSessions(),
                        getSellers(),
                        getGames(),
                    ]);
                    setBuyers(buyers);
                    setSessions(sessionsData);
                    setSellers(sellersData);
                    setGames(gamesData);

                    // Pré-remplir les détails de vente
                    const initialDetails: Record<number, { quantity: number }> = {};
                    sale.SaleDetails?.forEach(detail => {
                        initialDetails[detail.deposit_game_id] = { quantity: detail.quantity };
                    });
                    setSaleDetails(initialDetails);
                } catch (err) {
                    console.error('Erreur lors de la récupération des données:', err);
                    setError('Erreur lors de la récupération des données.');
                }
            };
            fetchData();
        }
    }, [open, sale]);

    const handleBuyerChange = (event: SelectChangeEvent<string | number>) => {
        setSelectedBuyer(event.target.value as number);
    };

    const handleSessionChange = (event: SelectChangeEvent<string | number>) => {
        setSelectedSession(event.target.value as number);
    };

    const handleDepositGameChange = (event: SelectChangeEvent<number[]>) => {
        const value = event.target.value as number[];
        setSelectedDepositGames(value);

        // Ajouter des détails pour les nouveaux jeux sélectionnés
        const newSaleDetails: Record<number, { quantity: number }> = { ...saleDetails };
        value.forEach((game_id) => {
            if (!newSaleDetails[game_id]) {
                newSaleDetails[game_id] = { quantity: 1 };
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
        game_id: number,
        field: keyof { quantity: number },
        value: number
    ) => {
        setSaleDetails((prev) => ({
            ...prev,
            [game_id]: {
                ...prev[game_id],
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

        if (selectedDepositGames.length === 0) {
            setError('Veuillez sélectionner au moins un jeu.');
            return;
        }

        // Vérifier que tous les jeux ont une quantité valide
        for (const game_id of selectedDepositGames) {
            const detail = saleDetails[game_id];
            if (!detail || detail.quantity <= 0) {
                setError('Veuillez définir une quantité valide pour tous les jeux.');
                return;
            }
        }

        setLoading(true);
        setError(null);

        try {
            // Mettre à jour la vente
            const updatedSale = await updateSale(sale.sale_id!, {
                buyer_id: selectedBuyer ? Number(selectedBuyer) : null,
                session_id: Number(selectedSession),
                sale_date: saleDate,
            });

            // Mettre à jour les détails de vente
            // Ici, vous devriez implémenter la logique pour ajouter, mettre à jour ou supprimer les SaleDetails
            // Selon vos besoins métier. Cela peut impliquer des appels supplémentaires au backend.

            // Pour simplifier, nous allons supposer que les détails actuels sont remplacés par les nouveaux
            // Vous devriez adapter cela selon votre logique spécifique

            // Supprimer les anciens détails
            // await deleteSaleDetailsBySaleId(sale.sale_id!); // Implémentez cette fonction si nécessaire

            // Créer les nouveaux détails
            // for (const game_id of selectedDepositGames) {
            //     await createSaleDetail({
            //         sale_id: sale.sale_id!,
            //         deposit_game_id: game_id,
            //         quantity: saleDetails[game_id].quantity,
            //     });
            // }

            // Récupérer la vente mise à jour avec les associations
            const fetchedSale = await getSaleById(sale.sale_id!);
            onUpdate(fetchedSale);

            // Afficher une notification de succès
            setSnackbarMessage('Vente mise à jour avec succès !');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);

            // Réinitialiser le formulaire
            onClose();
        } catch (err: any) {
            console.error('Erreur lors de la mise à jour de la vente:', err);
            setError(err.response?.data?.error || 'Échec de la mise à jour de la vente.');
            setSnackbarMessage(err.response?.data?.error || 'Échec de la mise à jour de la vente.');
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
        setSelectedDepositGames([]);
        setSaleDetails({});
        setSaleDate(new Date().toISOString().split('T')[0]);
        setSaleStatus('en cours');
        setCommission(0);
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
                    Mettre à Jour la Vente
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
                        {/* Remplacez par vos données réelles de buyers */}
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
                        value={selectedDepositGames}
                        onChange={handleDepositGameChange}
                        input={<OutlinedInput label="Jeux Déposés" />}
                        renderValue={(selected) => {
                            const selectedNames = games
                                .filter((game) => selected.includes(game.game_id))
                                .map((game) => `${game.name}`);
                            return selectedNames.join(', ');
                        }}
                    >
                        {games.map((game) => (
                            <MenuItem key={game.game_id} value={game.game_id}>
                                <Checkbox checked={selectedDepositGames.indexOf(game.game_id) > -1} />
                                <ListItemText
                                    primary={`${game.name} | Quantité: ${saleDetails[game.game_id]?.quantity || 1}`}
                                />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Afficher les détails des jeux sélectionnés */}
                {selectedDepositGames.map((game_id) => {
                    const game = games.find((g) => g.game_id === game_id);
                    const detail = saleDetails[game_id];
                    return (
                        <Box key={game_id} className="mb-4 p-2 border rounded">
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle1">{game?.name || 'Jeu Inconnu'}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        label="Quantité"
                                        type="number"
                                        variant="outlined"
                                        fullWidth
                                        value={detail?.quantity || 1}
                                        onChange={(e) =>
                                            handleSaleDetailChange(game_id, 'quantity', parseInt(e.target.value) || 1)
                                        }
                                        inputProps={{
                                            min: '1',
                                            // Vous pouvez ajouter une limite maximale si nécessaire, par exemple :
                                            // max: game?.availableQuantity || undefined
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={2}>
                                    <IconButton
                                        color="secondary"
                                        onClick={() => {
                                            setSelectedDepositGames((prev) => prev.filter((id) => id !== game_id));
                                            setSaleDetails((prev) => {
                                                const newDetails = { ...prev };
                                                delete newDetails[game_id];
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

                <Grid container spacing={2} className="mb-4">
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Commission (%)"
                            type="number"
                            variant="outlined"
                            fullWidth
                            value={commission}
                            onChange={(e) => setCommission(parseFloat(e.target.value))}
                            inputProps={{ step: '0.01', min: '0', max: '100' }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth variant="outlined">
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
                    </Grid>
                </Grid>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    fullWidth
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : 'Mettre à Jour la Vente'}
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

    export default UpdateSaleModal;