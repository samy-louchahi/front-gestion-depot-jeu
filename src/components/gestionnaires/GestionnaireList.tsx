import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import { getGestionnaires, createGestionnaire, updateGestionnaire, deleteGestionnaire } from '../../services/gestionnaireService';
import { Gestionnaire } from '../../types';

const GestionnaireList: React.FC = () => {
  const [gestionnaires, setGestionnaires] = useState<Gestionnaire[]>([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openFormDialog, setOpenFormDialog] = useState<boolean>(false);
  const [selectedGestionnaire, setSelectedGestionnaire] = useState<Gestionnaire | null>(null);
  const [formState, setFormState] = useState({ username: '', email: '', password: '', createdAt: new Date(), updatedAt: new Date() });

  // Charger la liste initiale des gestionnaires
  useEffect(() => {
    const fetchGestionnaires = async () => {
      const data = await getGestionnaires();
      setGestionnaires(data);
    };
    fetchGestionnaires();
  }, []);

  // Gérer les changements du formulaire
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  // Ouvrir le formulaire pour ajouter ou modifier
  const openForm = (gestionnaire: Gestionnaire | null = null) => {
    setSelectedGestionnaire(gestionnaire);
    setFormState({
      username: gestionnaire?.username || '',
      email: gestionnaire?.email || '',
      password: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    setOpenFormDialog(true);
  };

  // Gérer l’envoi du formulaire
  const handleSubmit = async () => {
    if (selectedGestionnaire) {
      // Mise à jour
      await updateGestionnaire(selectedGestionnaire.id, {
        ...formState,
        createdAt: formState.createdAt.toISOString(),
        updatedAt: formState.updatedAt.toISOString(),
      });
    } else {
      // Création
      await createGestionnaire({ ...formState, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }

    // Rafraîchir la liste
    const data = await getGestionnaires();
    setGestionnaires(data);
    setOpenFormDialog(false);
  };

  // Gérer la suppression
  const handleDelete = async () => {
    if (selectedGestionnaire) {
      await deleteGestionnaire(selectedGestionnaire.id);
      const data = await getGestionnaires();
      setGestionnaires(data);
      setOpenDialog(false);
    }
  };

  return (
    <Box className="p-6 space-y-6">
      <Box className="flex justify-between items-center">
        <Typography variant="h4" className="font-bold">
          Gestion des Gestionnaires
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => openForm()}
        >
          Ajouter un Gestionnaire
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nom d'utilisateur</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Date de Création</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {gestionnaires.map((gestionnaire) => (
              <TableRow key={gestionnaire.id}>
                <TableCell>{gestionnaire.id}</TableCell>
                <TableCell>{gestionnaire.username}</TableCell>
                <TableCell>{gestionnaire.email}</TableCell>
                <TableCell>{new Date(gestionnaire.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => openForm(gestionnaire)}>
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => {
                      setSelectedGestionnaire(gestionnaire);
                      setOpenDialog(true);
                    }}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Formulaire de création ou de mise à jour */}
      <Dialog open={openFormDialog} onClose={() => setOpenFormDialog(false)}>
        <DialogTitle>{selectedGestionnaire ? 'Modifier' : 'Ajouter'} un Gestionnaire</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nom d'utilisateur"
            name="username"
            value={formState.username}
            onChange={handleFormChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={formState.email}
            onChange={handleFormChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Mot de passe"
            type="password"
            name="password"
            value={formState.password}
            onChange={handleFormChange}
            margin="normal"
            helperText={selectedGestionnaire ? "Laissez vide pour ne pas changer" : "Requis pour la création"}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenFormDialog(false)} color="secondary">
            Annuler
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            {selectedGestionnaire ? 'Mettre à jour' : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialogue de confirmation de suppression */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer ce gestionnaire ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            Annuler
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GestionnaireList;