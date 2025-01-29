import React from 'react';
import { Session } from '../../types';
import { IconButton, Typography, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateIcon from '@mui/icons-material/Update';

interface SessionCardProps {
    session: Session;
    onDelete: (id: number) => void;
    onUpdate: (session: Session) => void;
    onViewDetails: (session: Session) => void;
}

const SessionCard: React.FC<SessionCardProps> = ({ session, onDelete, onUpdate, onViewDetails }) => {
    return (
        <Box
            className={`bg-white shadow-md rounded-lg p-4 border ${
                session.status ? 'border-green-500' : 'border-gray-300'
            } cursor-pointer hover:bg-gray-100`}
            onClick={() => onViewDetails(session)}
        >
            <Box className="flex justify-between items-center mb-2">
                <Typography variant="h6" component="h2">
                    {session.name}
                </Typography>
                <Box onClick={(e) => e.stopPropagation()}>
                    <IconButton
                        aria-label="update"
                        size="small"
                        onClick={() => onUpdate(session)}
                    >
                        <UpdateIcon className="text-blue-500" />
                    </IconButton>
                    <IconButton
                        aria-label="delete"
                        size="small"
                        onClick={() => session.session_id && onDelete(session.session_id)}
                    >
                        <DeleteIcon className="text-red-500" />
                    </IconButton>
                </Box>
            </Box>
            <Typography variant="body2" color="textSecondary">
                Début: {new Date(session.start_date).toLocaleDateString()}
            </Typography>
            <Typography variant="body2" color="textSecondary">
                Fin: {new Date(session.end_date).toLocaleDateString()}
            </Typography>
            <Typography variant="body2" color="textSecondary">
                Frais de dépôts: {session.fees} %
            </Typography>
            <Typography variant="body2" color="textSecondary">
                Commission: {session.commission} %
            </Typography>
            <Typography
                variant="body1"
                className={`font-semibold ${
                    session.status ? 'text-green-600' : 'text-red-600'
                }`}
            >
                Statut: {session.status ? 'Active' : 'Inactive'}
            </Typography>
        </Box>
    );
};

export default SessionCard;