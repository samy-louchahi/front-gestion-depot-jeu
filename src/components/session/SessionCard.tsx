// src/components/sessions/SessionCard.tsx

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
            className={`p-6 rounded-xl shadow-md border cursor-pointer hover:shadow-lg transition-all duration-200 ${
                session.status ? 'border-green-500' : 'border-gray-300'
            }`}
            onClick={() => onViewDetails(session)}
        >
            <Box className="flex justify-between items-center mb-4">
                <Typography variant='h6'className="text-2xl font-bold text-gray-900">{session.name}</Typography>
                <Box onClick={(e) => e.stopPropagation()}>
                    <IconButton size="small" onClick={() => onUpdate(session)}>
                        <UpdateIcon className="text-blue-500" />
                    </IconButton>
                    <IconButton size="small" onClick={() => session.session_id && onDelete(session.session_id)}>
                        <DeleteIcon className="text-red-500" />
                    </IconButton>
                </Box>
            </Box>

            <Typography className="text-sm text-gray-600 mb-1">
                <strong>Début :</strong> {new Date(session.start_date).toLocaleDateString()}
            </Typography>
            <Typography className="text-sm text-gray-600 mb-1">
                <strong>Fin :</strong> {new Date(session.end_date).toLocaleDateString()}
            </Typography>
            <Typography className="text-sm text-gray-600 mb-1">
                <strong>Frais de Dépôt :</strong> {session.fees} %
            </Typography>
            <Typography className="text-sm text-gray-600 mb-1">
                <strong>Commission :</strong> {session.commission} %
            </Typography>
            <Typography
                className={`font-semibold ${
                    session.status ? 'text-green-600' : 'text-red-600'
                }`}
            >
                Statut : {session.status ? 'Active' : 'Inactive'}
            </Typography>
        </Box>
    );
};

export default SessionCard;