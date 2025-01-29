// src/components/games/GameList.tsx

import React, { useEffect, useState } from 'react';
import { Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Game } from '../../types';
import { getGames, deleteGame } from '../../services/gameService';
import GameForm from './GameForm';
import ConfirmationDialog from '../common/ConfirmationDialog';
import GameCard from './GameCard';

const GameList: React.FC = () => {
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [openForm, setOpenForm] = useState<boolean>(false);
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);
    const [openConfirm, setOpenConfirm] = useState<boolean>(false);
    const [gameToDelete, setGameToDelete] = useState<number | null>(null);
    const [openDetailModal, setOpenDetailModal] = useState<boolean>(false);
    const [detailGame, setDetailGame] = useState<Game | null>(null);

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

    useEffect(() => {
        fetchGames();
    }, []);

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

    const cancelDelete = () => {
        setOpenConfirm(false);
        setGameToDelete(null);
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
        fetchGames(); // Rafraîchir la liste après ajout/mise à jour
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
                <Typography variant="h4" className="mb-4">
                    Liste des Jeux
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAdd}
                    className="bg-blue-500 hover:bg-blue-600"
                >
                    Ajouter un Jeu
                </Button>
            </div>
            {error && <Typography color="error" className="text-center mb-4">{error}</Typography>}
            <ul className="space-y-4 w-full max-w-md mx-auto">
                {games.map((game) => (
                    <GameCard
                        key={game.game_id}
                        game={game}
                        onUpdate={handleUpdate}
                        onDelete={handleDelete}
                        onViewDetails={handleViewDetails}
                    />
                ))}
            </ul>

            {/* Formulaire Ajout/Mise à Jour */}
            <GameForm
                open={openForm}
                onClose={handleFormClose}
                game={selectedGame}
                onSuccess={fetchGames}
            />

            {/* Dialogue de Confirmation Suppression */}
            <ConfirmationDialog
                open={openConfirm}
                title="Confirmer la Suppression"
                content="Êtes-vous sûr de vouloir supprimer ce jeu ?"
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />
        </div>
    );
};

export default GameList;