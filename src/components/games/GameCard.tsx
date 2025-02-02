import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, IconButton, CardActions, Button, CardMedia } from '@mui/material';
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
    // Définissez le chemin vers votre image par défaut
    const defaultImage = '/affiche_FDJ_montpellier.jpg'; // Assurez-vous que cette image est accessible (dans le dossier public par exemple)

    // Utilisez un état local pour gérer la source de l'image
    const [imageSrc, setImageSrc] = useState<string>(game.picture || defaultImage);

    // Si la prop game.picture change, on met à jour l'état
    useEffect(() => {
        setImageSrc(game.picture || defaultImage);
    }, [game.picture]);

    return (
        <Card className="shadow-md">
            <CardMedia
                component="img"
                height="4"
                image={imageSrc}
                alt={game.name}
                // Si l'image ne se charge pas, on passe à l'image par défaut
                onError={() => setImageSrc(defaultImage)}
                className="rounded-t-md object-cover"
                sx={{
                    height: 40, // hauteur de l'image
                    objectFit: 'cover', // redimensionner l'image pour qu'elle remplisse le conteneur
                        borderTopLeftRadius: '4px',  // Exemple pour arrondir le coin
                        borderTopRightRadius: '4px',
                }}
            />

            <CardContent onClick={() => onViewDetails(game)} style={{ cursor: 'pointer' }}>
                <Typography variant="h6" className="font-bold">
                    {game.name}
                </Typography>
                <Typography color="textSecondary" className="mb-1 text-sm">
                    <strong color='textPrimary'>Éditeur : </strong>{game.publisher}
                </Typography>
            </CardContent>

            <CardActions className="justify-between px-2">
                <IconButton aria-label="edit" onClick={() => onUpdate(game)}>
                    <EditIcon fontSize="small" />
                </IconButton>
                <IconButton aria-label="delete" onClick={() => onDelete(game.game_id)}>
                    <DeleteIcon fontSize="small" />
                </IconButton>
                <Button size="small" startIcon={<VisibilityIcon />} onClick={() => onViewDetails(game)}>
                    Détails
                </Button>
            </CardActions>
        </Card>
    );
};

export default GameCard;