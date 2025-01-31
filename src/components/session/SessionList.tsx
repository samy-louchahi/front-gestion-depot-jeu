import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import { Session } from '../../types';
import { getSessions, deleteSession } from '../../services/sessionService';
import SessionCard from './SessionCard';
import AddSessionModal from './AddSessionModal';
import UpdateSessionModal from './UpdateSessionModal';
import ConfirmationDialog from '../common/ConfirmationDialog';
import SessionDetailModal from './SessionDetailModal';

const SessionList: React.FC = () => {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [openAdd, setOpenAdd] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [currentSession, setCurrentSession] = useState<Session | null>(null);
    const [openConfirm, setOpenConfirm] = useState<boolean>(false);
    const [sessionToDelete, setSessionToDelete] = useState<number | null>(null);
    const [openDetailModal, setOpenDetailModal] = useState<boolean>(false);
    const [detailSession, setDetailSession] = useState<Session | null>(null);

    const fetchSessions = async () => {
        setLoading(true);
        try {
            const data = await getSessions();
            setSessions(data);
            setError(null);
        } catch (err: any) {
            console.error(err);
            setError('Échec de la récupération des sessions.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, []);

    const handleDelete = (session_id: number) => {
        setSessionToDelete(session_id);
        setOpenConfirm(true);
    };

    const confirmDelete = async () => {
        if (sessionToDelete === null) return;
        try {
            await deleteSession(sessionToDelete);
            setSessions(sessions.filter(session => session.session_id !== sessionToDelete));
            setError(null);
        } catch (err: any) {
            console.error(err);
            setError('Erreur lors de la suppression de la session.');
        } finally {
            setOpenConfirm(false);
            setSessionToDelete(null);
        }
    };

    const cancelDelete = () => {
        setOpenConfirm(false);
        setSessionToDelete(null);
    };

    const handleUpdate = (session: Session) => {
        setCurrentSession(session);
        setOpenUpdate(true);
    };

    const handleAdd = () => {
        setCurrentSession(null);
        setOpenAdd(true);
    };

    const handleFormClose = () => {
        setOpenAdd(false);
        setOpenUpdate(false);
        setCurrentSession(null);
        fetchSessions(); // Rafraîchir la liste après ajout/mise à jour
    };

    const handleViewDetails = (session: Session) => {
        setDetailSession(session);
        setOpenDetailModal(true);
    };

    const handleDetailModalClose = () => {
        setOpenDetailModal(false);
        setDetailSession(null);
    };

    if (loading) {
        return <Typography className="text-center mt-10">Chargement...</Typography>;
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                {/* Titre avec plus de style */}
                <Typography variant='h4'className="text-3xl font-extrabold text-gray-800">Liste des Sessions</Typography>
                {/* Bouton amélioré */}
                <button
                    onClick={handleAdd}
                    className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-full shadow-lg transition duration-300"
                >
                    + Créer une Session
                </button>
            </div>
            {error && (
                <Typography color="error" className="text-center mb-4">
                    {error}
                </Typography>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {sessions.length > 0 ? (
                    sessions.map(session => (
                        <SessionCard
                            key={session.session_id}
                            session={session}
                            onDelete={handleDelete}
                            onUpdate={handleUpdate}
                            onViewDetails={handleViewDetails}
                        />
                    ))
                ) : (
                    <Typography className="text-center w-full" variant="h6">
                        Aucune session disponible.
                    </Typography>
                )}
            </div>
            {detailSession && (
                <SessionDetailModal
                    open={openDetailModal}
                    onClose={handleDetailModalClose}
                    session_id={detailSession?.session_id ?? 0}
                />
            )}
            <AddSessionModal
                open={openAdd}
                onClose={handleFormClose}
                onAdd={(newSession) => {
                    setSessions([...sessions, { ...newSession, status: false, session_id: Date.now() }]);
                    handleFormClose();
                }}
            />
            <UpdateSessionModal
                open={openUpdate}
                onClose={handleFormClose}
                onUpdate={(updatedSession) => {
                    setSessions(sessions.map(session => session.session_id === updatedSession.session_id ? updatedSession : session));
                    handleFormClose();
                }}
                session={currentSession}
            />
            <ConfirmationDialog
                open={openConfirm}
                title="Confirmer la Suppression"
                content="Êtes-vous sûr de vouloir supprimer cette session ?"
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />
        </div>
    );
};

export default SessionList;