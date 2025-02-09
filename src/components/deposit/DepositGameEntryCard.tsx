// src/components/deposits/DepositGameEntryCard.tsx

import React from 'react';
import { Card, CardContent, Grid, FormControl, InputLabel, Select, MenuItem, TextField, IconButton, Typography, Box, OutlinedInput, Button } from '@mui/material';
import { RemoveCircleOutline, AddCircleOutline } from '@mui/icons-material';
import { Game } from '../../types';

// Définition locale du type DepositGameEntry
export interface DepositGameEntry {
  id: number; // identifiant local (non envoyé au backend)
  game_id: number | null;
  fees?: number;
  exemplaires: { [key: string]: { price: number; state: string } };
}

interface DepositGameEntryCardProps {
  entry: DepositGameEntry;
  games: Game[];
  onUpdateEntry: (id: number, field: keyof Omit<DepositGameEntry, 'id' | 'exemplaires'>, value: any) => void;
  onUpdateExemplaire: (id: number, index: number, field: 'price' | 'state', value: any) => void;
  onAddExemplaire: (id: number) => void;
  onRemoveEntry: (id: number) => void;
}

const stateOptions = ["neuf", "très bon", "bon", "occasion"];

const DepositGameEntryCard: React.FC<DepositGameEntryCardProps> = ({
  entry,
  games,
  onUpdateEntry,
  onUpdateExemplaire,
  onAddExemplaire,
  onRemoveEntry,
}) => {
  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          {/* Sélection du jeu */}
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id={`game-select-${entry.id}`}>Jeu</InputLabel>
              <Select
                labelId={`game-select-${entry.id}`}
                label="Jeu"
                value={entry.game_id !== null ? entry.game_id.toString() : ''}
                onChange={(e) =>
                  onUpdateEntry(entry.id, 'game_id', Number(e.target.value))
                }
                input={<OutlinedInput label="Jeu" />}
              >
                {games.map((game) => (
                  <MenuItem key={game.game_id} value={game.game_id.toString()}>
                    {game.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {/* Bouton supprimer l'article */}
          <Grid item xs={12} sm={2}>
            <IconButton color="secondary" onClick={() => onRemoveEntry(entry.id)}>
              <RemoveCircleOutline />
            </IconButton>
          </Grid>
        </Grid>
        <Box mt={2}>
          <Typography variant="subtitle2" mb={1}>Exemplaires :</Typography>
          {Object.keys(entry.exemplaires).map((key, index) => {
            const ex = entry.exemplaires[key];
            return (
              <Grid container spacing={1} key={key} alignItems="center" sx={{ mb: 1 }}>
                <Grid item xs={6}>
                  <TextField
                    label={`Prix exemplaire ${index + 1} (€)`}
                    type="number"
                    variant="outlined"
                    fullWidth
                    value={ex.price}
                    onChange={(e) => onUpdateExemplaire(entry.id, index, 'price', parseFloat(e.target.value))}
                    inputProps={{ step: '0.01' }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id={`state-label-${entry.id}-${key}`}>État exemplaire {index + 1}</InputLabel>
                    <Select
                      labelId={`state-label-${entry.id}-${key}`}
                      label={`État exemplaire ${index + 1}`}
                      value={ex.state}
                      onChange={(e) => onUpdateExemplaire(entry.id, index, 'state', e.target.value)}
                    >
                      {stateOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            );
          })}
          <Button
            variant="outlined"
            startIcon={<AddCircleOutline />}
            onClick={() => onAddExemplaire(entry.id)}
          >
            Ajouter exemplaire
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DepositGameEntryCard;