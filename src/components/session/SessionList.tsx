// src/components/sessions/SessionList.tsx

import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateIcon from '@mui/icons-material/Update';
import axios from 'axios';
import SessionCard from './SessionCard';
import AddSessionModal from './AddSessionModal';
import UpdateSessionModal from './UpdateSessionModal';

interface Session {
    session_id?: number;
    name: string;
    start_date: string;
    end_date: string;
    status: boolean;
    fees: number;
    commission: number;
}

const SessionList: React.FC = () => {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [openAdd, setOpenAdd] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [currentSession, setCurrentSession] = useState<Session | null>(null);

    const handleOpenAdd = () => {
        setCurrentSession(null);
        setOpenAdd(true);
    }

    const handleCloseAdd = () => {
        setOpenAdd(false);
    }

    const handleOpenUpdate = (session: Session) => {
        setCurrentSession(session);
        setOpenUpdate(true);
    };

    const handleCloseUpdate = () => {
        setOpenUpdate(false);
    }

    const handleAddSession = async (newSession: Omit<Session, 'session_id' | 'status'>) => {
        try {
            const response = await axios.post('http://localhost:3000/api/sessions', {
                ...newSession,
                status: false // Initialiser le statut par défaut
            });

            setSessions([...sessions, response.data]);
            setError(null);
        } catch (error) {
            console.error('Error adding session:', error);
            setError('Échec de l\'ajout de la session.');
        }
    }

    const handleUpdateSession = async (updatedSession: Session) => {
        const { session_id, ...updateData } = updatedSession;

        if (!session_id) {
            setError('ID de session manquant.');
            return;
        }

        try {
            const response = await axios.put(`http://localhost:3000/api/sessions/${session_id}`, updateData);
            setSessions(sessions.map(session => session.session_id === session_id ? response.data : session));
            setError(null);
        } catch (error) {
            console.error('Error updating session:', error);
            setError('Échec de la mise à jour de la session.');
        }
    }

    const handleDeleteSession = async (session_id: number) => {
        try {
            await axios.delete(`http://localhost:3000/api/sessions/${session_id}`);
            setSessions(sessions.filter(session => session.session_id !== session_id));
            setError(null);
        } catch (error) {
            console.error('Error deleting session:', error);
            setError('Échec de la suppression de la session.');
        }
    }

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/sessions');
                setSessions(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching sessions:', error);
                setError('Échec de la récupération des sessions.');
                setLoading(false);
            }
        };

        fetchSessions();
    }, []);

    if (loading) {
        return <div className="text-center mt-10">Chargement...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <div className="text-center mb-4">
                <Typography variant="h4" className="font-bold mb-4">
                    Liste des Sessions
                </Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAdd}>
                    Créer une Session
                </Button>
            </div>
            {error && (
                <Typography className="text-center mb-4 text-red-500">
                    {error}
                </Typography>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {sessions.length > 0 ? (
                    sessions.map(session => (
                        <SessionCard
                            key={session.session_id}
                            session={session}
                            onDelete={handleDeleteSession}
                            onUpdate={handleOpenUpdate}
                        />
                    ))
                ) : (
                    <Typography className="text-center w-full" variant="h6">
                        Aucune session disponible.
                    </Typography>
                )}
            </div>

            {/* Add Session Modal */}
            <AddSessionModal
                open={openAdd}
                onClose={handleCloseAdd}
                onAdd={handleAddSession}
            />

            {/* Update Session Modal */}
            <UpdateSessionModal
                open={openUpdate}
                onClose={handleCloseUpdate}
                onUpdate={handleUpdateSession}
                session={currentSession}
            />
        </div>
    );
}

export default SessionList;