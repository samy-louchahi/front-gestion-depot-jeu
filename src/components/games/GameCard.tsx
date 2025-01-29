import React from 'react';
import { Game } from '../../types';
import { IconButton, Typography } from '@mui/material';
import UpdateIcon from '@mui/icons-material/Update';
import DeleteIcon from '@mui/icons-material/Delete';

interface GameCardProps {
    game: Game;
    onUpdate: (game: Game) => void;
    onDelete: (game_id: number) => void;
    onViewDetails: (game: Game) => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, onUpdate, onDelete, onViewDetails }) => {
    return (
        <li
            className="border p-4 rounded shadow-md w-full max-w-md cursor-pointer hover:bg-gray-100"
            onClick={() => onViewDetails(game)}
        >
            <div className="flex justify-between items-center">
                <Typography variant="h6">{game.name}</Typography>
                <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                    <IconButton onClick={() => onUpdate(game)}>
                        <UpdateIcon className="text-blue-500" />
                    </IconButton>
                    <IconButton onClick={() => onDelete(game.game_id!)}>
                        <DeleteIcon className="text-red-500" />
                    </IconButton>
                </div>
            </div>
            <Typography>Éditeur: {game.publisher}</Typography>
        </li>
    );
};

export default GameCard;