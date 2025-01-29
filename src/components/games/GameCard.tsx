// src/components/games/GameCard.tsx

import React from 'react';
import { Card, CardContent, Typography, IconButton, CardActions, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Game } from '../../types';

interface GameCardProps {
    game: Game;
    onUpdate: (game: Game) => void;
    onDelete: (game_id: number) => void;
    onViewDetails: (game: Game) => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, onUpdate, onDelete, onViewDetails }) => {
    return (
        <Card className="shadow-md">
            <CardContent onClick={() => onViewDetails(game)} style={{ cursor: 'pointer' }}>
                <Typography variant="h6">{game.name}</Typography>
                <Typography color="textSecondary">{game.publisher}</Typography>
            </CardContent>
            <CardActions>
                <IconButton aria-label="edit" onClick={() => onUpdate(game)}>
                    <EditIcon />
                </IconButton>
                <IconButton aria-label="delete" onClick={() => onDelete(game.game_id)}>
                    <DeleteIcon />
                </IconButton>
                <Button
                    size="small"
                    startIcon={<VisibilityIcon />}
                    onClick={() => onViewDetails(game)}
                >
                    Détails
                </Button>
            </CardActions>
        </Card>
    );
};

export default GameCard;