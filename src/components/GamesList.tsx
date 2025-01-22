import React, { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import { IconButton, Modal, Box, TextField, Typography } from '@mui/material';
import axios from 'axios';

interface Game {
    game_id?: number; // Optionnel car généré par le backend
    name: string;
    publisher: string;
}

const GamesList: React.FC = () => {
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const [newGame, setNewGame] = useState<Game>({
        name: '',
        publisher: '',
    });

    // Ouvre le modal pour ajouter un jeu
    const handleOpen = () => {
        setNewGame({
            name: '',
            publisher: '',
        });
        setOpen(true);
    };

    // Ferme le modal
    const handleClose = () => {
        setOpen(false);
    };

    // Gère les changements dans les champs de formulaire
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewGame({
            ...newGame,
            [name]: value
        });
    };

    // Soumet le formulaire pour ajouter un jeu
    const handleSubmit = async () => {
        const { name, publisher } = newGame;

        // Validation des champs
        if (!name.trim() || !publisher.trim()) {
            setError('Veuillez remplir tous les champs obligatoires.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/api/games', {
                name: name.trim(),
                publisher: publisher.trim()
            });

            setGames([...games, response.data]);
            setNewGame({
                name: '',
                publisher: '',
            });
            handleClose();
            setError(null);
        } catch (err: any) {
            console.error('Erreur lors de l\'ajout du jeu:', err);
            setError(err.response?.data?.error || 'Échec de l\'ajout du jeu.');
        }
    };

    // Supprime un jeu
    const deleteGame = async (game_id: number) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce jeu ?')) return;

        try {
            await axios.delete(`http://localhost:3000/api/games/${game_id}`);
            setGames(games.filter((game) => game.game_id !== game_id));
            setError(null);
        } catch (err: any) {
            console.error('Erreur lors de la suppression du jeu:', err);
            setError(err.response?.data?.error || 'Échec de la suppression du jeu.');
        }
    }

    // Récupère les jeux depuis le backend
    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/games');
                setGames(response.data);
            } catch (err) {
                console.error('Erreur lors de la récupération des jeux:', err);
                setError('Échec de la récupération des jeux.');
            } finally {
                setLoading(false);
            }
        };

        fetchGames();
    }, []);

    if (loading) {
        return <div className="text-center mt-10">Chargement...</div>;
    }

    return (
        <div className="flex flex-col items-center space-y-4">
            <h1 className="text-3xl font-bold mb-4">Liste des Jeux</h1>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
                Ajouter un Jeu
            </Button>
            {error && <div className="text-center mt-2 text-red-500">{error}</div>}
            <ul className="space-y-4 w-full max-w-md">
                {games.map((game) => (
                    <li key={game.game_id} className="border p-4 rounded shadow-md">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold">{game.name}</h2>
                            <IconButton aria-label="delete" size="small" onClick={() => deleteGame(game.game_id!)}>
                                <DeleteIcon />
                            </IconButton>
                        </div>
                        <p>Éditeur: {game.publisher}</p>
                    </li>
                ))}
            </ul>

            {/* Modal pour ajouter un jeu */}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="add-game-modal"
                aria-describedby="modal-to-add-game"
            >
                <Box
                    className="bg-white p-6 rounded-lg w-full max-w-md mx-auto mt-20 shadow-lg"
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        alignItems: 'center'
                    }}
                >
                    <Typography variant="h6" id="add-game-modal">
                        Ajouter un nouveau jeu
                    </Typography>

                    <TextField
                        label="Nom"
                        variant="outlined"
                        fullWidth
                        name="name"
                        value={newGame.name}
                        onChange={handleInputChange}
                        className="mb-4"
                    />

                    <TextField
                        label="Éditeur"
                        variant="outlined"
                        fullWidth
                        name="publisher"
                        value={newGame.publisher}
                        onChange={handleInputChange}
                        className="mb-4"
                    />

                    <div className="flex gap-4 w-full">
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={handleClose}
                            className="flex-1"
                        >
                            Annuler
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            className="flex-1"
                        >
                            Ajouter
                        </Button>
                    </div>
                </Box>
            </Modal>
        </div>
    );
};

export default GamesList;