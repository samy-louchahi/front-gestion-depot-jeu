// src/components/games/GameForm.tsx

import React, { useState, useEffect, ChangeEvent } from 'react';
import {
  Button,
  TextField,
  Typography,
  Box,
  Modal
} from '@mui/material';
import { Game } from '../../types';
import { createGame, updateGame } from '../../services/gameService';

interface GameFormProps {
  open: boolean;
  onClose: () => void;
  game: Game | null;
  onSuccess: () => void; // Callback pour rafraîchir la liste après l'opération
}

const GameForm: React.FC<GameFormProps> = ({ open, onClose, game, onSuccess }) => {
  // On gère ici les champs classiques ainsi que le fichier image
  const [formData, setFormData] = useState<Omit<Game, 'game_id'>>({
    name: '',
    publisher: '',
    description: '',
    picture: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Au chargement ou lors d'une modification du jeu (pour update), on préremplit le formulaire
  useEffect(() => {
    if (game) {
      setFormData({
        name: game.name,
        publisher: game.publisher,
        description: game.description,
        picture: game.picture, // URL existant en cas d'update
      });
      setPreviewUrl(game.picture); // On affiche l'image déjà présente
      setSelectedFile(null);
    } else {
      setFormData({
        name: '',
        publisher: '',
        description: '',
        picture: '',
      });
      setPreviewUrl('');
      setSelectedFile(null);
    }
  }, [game]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Gestion du changement du fichier image
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      // Création d'une URL pour l'aperçu
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    const { name, publisher } = formData;

    // Vérification des champs obligatoires
    if (!name.trim() || !publisher.trim()) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    try {
      // Création d'un FormData pour gérer le multipart
      const data = new FormData();
      data.append('name', formData.name);
      data.append('publisher', formData.publisher);
      data.append('description', formData.description);
      
      // Si un fichier a été sélectionné, on l'ajoute dans le FormData.
      // Sinon, on peut envoyer l'URL déjà existante (dans le cas d'une mise à jour)
      if (selectedFile) {
        data.append('picture', selectedFile);
      } else if (formData.picture) {
        data.append('picture', formData.picture);
      }

      if (game) {
        await updateGame(game.game_id!, data);
      } else {
        await createGame(data);
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

        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          name="description"
          multiline
          minRows={3}
          value={formData.description}
          onChange={handleChange}
        />

        {/* Champ d'upload de fichier */}
        <Button variant="outlined" component="label" fullWidth>
          {selectedFile || previewUrl ? 'Modifier l\'image' : 'Télécharger une image'}
          <input type="file" hidden accept="image/*" onChange={handleFileChange} />
        </Button>

        {/* Aperçu de l'image */}
        {previewUrl && (
          <Box sx={{ mt: 2 }}>
            <img
              src={previewUrl}
              alt="Aperçu du jeu"
              style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8 }}
            />
          </Box>
        )}

        {error && <Typography color="error">{error}</Typography>}

        <Box className="flex gap-4 w-full">
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
        </Box>
      </Box>
    </Modal>
  );
};

export default GameForm;