import React, { useEffect, useState } from 'react';
import { Button, Typography, TextField, FormControlLabel, Checkbox, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Game, Stock } from '../../types';
import { getGames, deleteGame, importGames, getGameStocks } from '../../services/gameService';
import GameForm from './GameForm';
import ConfirmationDialog from '../common/ConfirmationDialog';
import GameCard from './GameCard';
import GameDetailModal from './GameDetailModal';

const GameList: React.FC = () => {
    const [games, setGames] = useState<Game[]>([]);
    const [gameStocks, setGameStocks] = useState<{ [gameId: number]: Stock[] }>({});
    const [filteredGames, setFilteredGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [openForm, setOpenForm] = useState<boolean>(false);
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);
    const [openConfirm, setOpenConfirm] = useState<boolean>(false);
    const [gameToDelete, setGameToDelete] = useState<number | null>(null);
    const [openDetailModal, setOpenDetailModal] = useState<boolean>(false);
    const [detailGame, setDetailGame] = useState<Game | null>(null);
    const [searchPublisher, setSearchPublisher] = useState<string>('');
    const [filterHasStock, setFilterHasStock] = useState<boolean>(false);

    const fetchGames = async () => {
        setLoading(true);
        try {
            const data = await getGames();
            setGames(data);
            setError(null);
        } catch (err: any) {
            console.error(err);
            setError('Erreur lors de la récupération des jeux.');
        } finally {
            setLoading(false);
        }
    };
    const fetchGamesWithStocks = async () => {
        setLoading(true);
        try {
            const gamesData = await getGames();
            setGames(gamesData);
            setFilteredGames(gamesData);

            // Récupérer les stocks pour chaque jeu
            const stocksMap: { [gameId: number]: Stock[] } = {};
            await Promise.all(
                gamesData.map(async (game) => {
                    const stocks = await getGameStocks(game.game_id);
                    stocksMap[game.game_id] = stocks;
                })
            );
            setGameStocks(stocksMap);
            setError(null);
        } catch (err: any) {
            console.error(err);
            setError('Erreur lors de la récupération des jeux.');
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchGames();
        fetchGamesWithStocks();
    }, []);

    useEffect(() => {
        let filtered = games;

        // Filtrer par éditeur
        if (searchPublisher.trim()) {
            filtered = filtered.filter((game) =>
                game.publisher.toLowerCase().includes(searchPublisher.toLowerCase())
            );
        }

        // Filtrer les jeux ayant des stocks
        if (filterHasStock) {
            filtered = filtered.filter(
                (game) => gameStocks[game.game_id]?.some((stock) => stock.current_quantity > 0)
            );
        }

        setFilteredGames(filtered);
    }, [games, searchPublisher, filterHasStock, gameStocks]);

    const handleImportCSV = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
    
        try {
            await importGames(formData);
            alert('Fichier importé avec succès');
            fetchGames();
        } catch (err) {
            console.error('Erreur lors de l\'importation du fichier :', err);
            alert('Échec de l\'importation du fichier CSV.');
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleImportCSV(e.target.files[0]);
        }
    };

    const handleDelete = (game_id: number) => {
        setGameToDelete(game_id);
        setOpenConfirm(true);
    };

    const confirmDelete = async () => {
        if (gameToDelete === null) return;
        try {
            await deleteGame(gameToDelete);
            setGames(games.filter(game => game.game_id !== gameToDelete));
            setError(null);
        } catch (err: any) {
            console.error(err);
            setError('Erreur lors de la suppression du jeu.');
        } finally {
            setOpenConfirm(false);
            setGameToDelete(null);
        }
    };

    const handleUpdate = (game: Game) => {
        setSelectedGame(game);
        setOpenForm(true);
    };

    const handleAdd = () => {
        setSelectedGame(null);
        setOpenForm(true);
    };

    const handleFormClose = () => {
        setOpenForm(false);
        setSelectedGame(null);
        fetchGames();
    };

    const handleViewDetails = (game: Game) => {
        setDetailGame(game);
        setOpenDetailModal(true);
    };

    const handleDetailModalClose = () => {
        setOpenDetailModal(false);
        setDetailGame(null);
    };

    if (loading) {
        return <Typography className="text-center mt-10">Chargement...</Typography>;
    }

    return (
        <div className="p-4">
            <div className="flex flex-col items-center mb-6">
                <div className="flex justify-between items-center gap-4 w-full">
                    <Typography variant="h4" className="mb-4">
                        Liste des Jeux
                    </Typography>
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={handleAdd}
                            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-full shadow-lg transition duration-300"
                        >
                            + Ajouter un Jeu
                        </button>
                        <label htmlFor="import-csv" className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-full shadow-lg transition duration-300 cursor-pointer">
                            + Importer CSV
                        </label>
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            className="hidden"
                            id="import-csv"
                        />
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                    <TextField
                        label="Recherche par éditeur"
                        variant="outlined"
                        size="small"
                        value={searchPublisher}
                        onChange={(e) => setSearchPublisher(e.target.value)}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={filterHasStock}
                                onChange={(e) => setFilterHasStock(e.target.checked)}
                            />
                        }
                        label="Afficher uniquement les jeux avec stock"
                    />
                </div>
                {error && <Typography color="error" className="text-center mb-4">{error}</Typography>}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredGames.map((game) => (
                    <GameCard
                        key={game.game_id}
                        game={game}
                        onUpdate={handleUpdate}
                        onDelete={handleDelete}
                        onViewDetails={handleViewDetails}
                    />
                ))}
                </div>
            </div>
            {error && <Typography color="error" className="text-center mb-4">{error}</Typography>}
            

            <GameForm
                open={openForm}
                onClose={handleFormClose}
                game={selectedGame}
                onSuccess={fetchGames}
            />

            <ConfirmationDialog
                open={openConfirm}
                title="Confirmer la Suppression"
                content="Êtes-vous sûr de vouloir supprimer ce jeu ?"
                onConfirm={confirmDelete}
                onCancel={() => setOpenConfirm(false)}
            />

            {detailGame && (
                <GameDetailModal
                    open={openDetailModal}
                    onClose={handleDetailModalClose}
                    game={detailGame}
                />
            )}
        </div>
    );
};

export default GameList;