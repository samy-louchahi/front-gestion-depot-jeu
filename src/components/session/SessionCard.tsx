// src/components/sessions/SessionCard.tsx

import React from 'react';
import { IconButton, Typography, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateIcon from '@mui/icons-material/Update';
import { formatCurrency } from '../../utils/formatCurrency';

interface Session {
    session_id?: number;
    name: string;
    start_date: string;
    end_date: string;
    status: boolean;
    fees: number;
    commission: number;
}

interface SessionCardProps {
    session: Session;
    onDelete: (id: number) => void;
    onUpdate: (session: Session) => void;
}

const SessionCard: React.FC<SessionCardProps> = ({ session, onDelete, onUpdate }) => {
    return (
        <Box
            className={`bg-white shadow-md rounded-lg p-4 border ${
                session.status ? 'border-green-500' : 'border-gray-300'
            }`}
        >
            <Box className="flex justify-between items-center mb-2">
                <Typography variant="h6" component="h2">
                    {session.name}
                </Typography>
                <Box>
                    <IconButton
                        aria-label="update"
                        size="small"
                        onClick={() => onUpdate(session)}
                    >
                        <UpdateIcon />
                    </IconButton>
                    <IconButton
                        aria-label="delete"
                        size="small"
                        onClick={() => session.session_id && onDelete(session.session_id)}
                    >
                        <DeleteIcon />
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