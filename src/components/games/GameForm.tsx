import React, { useState, useEffect } from 'react';
import { Button, TextField, Typography } from '@mui/material';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { Game } from '../../types';
import { createGame, updateGame } from '../../services/gameService';

interface GameFormProps {
    open: boolean;
    onClose: () => void;
    game: Game | null;
    onSuccess: () => void; // Callback pour rafraîchir la liste après l'opération
}

const GameForm: React.FC<GameFormProps> = ({ open, onClose, game, onSuccess }) => {
    const [formData, setFormData] = useState<Omit<Game, 'game_id'>>({
        name: '',
        publisher: '',
    });
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (game) {
            setFormData({
                name: game.name,
                publisher: game.publisher,
            });
        } else {
            setFormData({
                name: '',
                publisher: '',
            });
        }
    }, [game]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        const { name, publisher } = formData;

        // Validation des champs
        if (!name.trim() || !publisher.trim()) {
            setError('Veuillez remplir tous les champs obligatoires.');
            return;
        }

        try {
            if (game) {
                await updateGame(game.game_id!, formData);
            } else {
                await createGame(formData);
            }
            setError(null);
            onSuccess();
            onClose();
        } catch (err: any) {
            console.error('Erreur lors de l\'opération:', err);
            setError(err.response?.data?.error || 'Échec de l\'opération.');
        }
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="game-form-modal"
            aria-describedby="modal-to-add-or-update-game"
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
                <Typography variant="h6" id="game-form-modal">
                    {game ? 'Mettre à Jour le Jeu' : 'Ajouter un Nouveau Jeu'}
                </Typography>

                <TextField
                    label="Nom"
                    variant="outlined"
                    fullWidth
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                />

                <TextField
                    label="Éditeur"
                    variant="outlined"
                    fullWidth
                    name="publisher"
                    value={formData.publisher}
                    onChange={handleChange}
                />

                {error && <Typography color="error">{error}</Typography>}

                <div className="flex gap-4 w-full">
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={onClose}
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
                        {game ? 'Mettre à Jour' : 'Ajouter'}
                    </Button>
                </div>
            </Box>
        </Modal>
    );
};

export default GameForm;