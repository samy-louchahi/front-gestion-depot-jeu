// src/components/sessions/UpdateSessionModal.tsx

import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Typography, Button, Switch, FormControlLabel } from '@mui/material';
import { Session } from '../../types';
import { updateSession } from '../../services/sessionService';

interface UpdateSessionModalProps {
    open: boolean;
    onClose: () => void;
    onUpdate: (session: Session) => void;
    session: Session | null;
}

const UpdateSessionModal: React.FC<UpdateSessionModalProps> = ({ open, onClose, onUpdate, session }) => {
    const [updatedSession, setUpdatedSession] = useState<Session>({
        session_id: undefined,
        name: '',
        start_date: '',
        end_date: '',
        status: false,
        fees: 0,
        commission: 0
    });

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (session) {
            setUpdatedSession(session);
        }
    }, [session]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        let newValue: any = value;

        if (type === 'number') {
            newValue = parseFloat(value);
        }

        if (name === 'status') {
            newValue = checked;
        }

        setUpdatedSession({
            ...updatedSession,
            [name]: newValue
        });
    };

    const handleSubmit = async () => {
        const { session_id, name, start_date, end_date, fees, commission, status } = updatedSession;

        // Validation des champs
        if (!name || !start_date || !end_date) {
            setError('Veuillez remplir tous les champs requis.');
            return;
        }

        if (!session_id) {
            setError('ID de session manquant.');
            return;
        }

        try {
            await updateSession(session_id, {
                name,
                start_date,
                end_date,
                fees,
                commission,
                status
            });
            setError(null);
            onUpdate(updatedSession);
            onClose();
        } catch (err: any) {
            console.error('Erreur lors de la mise à jour de la session:', err);
            setError(err.response?.data?.error || 'Échec de la mise à jour de la session.');
        }
    };

    if (!session) return null;

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                className="bg-white p-6 rounded-lg w-full max-w-md mx-auto mt-20 shadow-lg"
                sx={{
                    position: 'absolute' as 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                }}
            >
                <Typography variant="h5" className="text-center mb-4">
                    Mettre à Jour la Session
                </Typography>
                <TextField
                    label="Nom"
                    name="name"
                    value={updatedSession.name}
                    onChange={handleInputChange}
                    variant="outlined"
                    fullWidth
                    className="mb-4"
                />
                <TextField
                    label="Date de Début"
                    name="start_date"
                    type="date"
                    value={updatedSession.start_date}
                    onChange={handleInputChange}
                    variant="outlined"
                    fullWidth
                    className="mb-4"
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    label="Date de Fin"
                    name="end_date"
                    type="date"
                    value={updatedSession.end_date}
                    onChange={handleInputChange}
                    variant="outlined"
                    fullWidth
                    className="mb-4"
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    label="Frais (%)"
                    name="fees"
                    type="number"
                    value={updatedSession.fees}
                    onChange={handleInputChange}
                    variant="outlined"
                    fullWidth
                    className="mb-4"
                    inputProps={{ step: "0.01" }}
                />
                <TextField
                    label="Commission (%)"
                    name="commission"
                    type="number"
                    value={updatedSession.commission}
                    onChange={handleInputChange}
                    variant="outlined"
                    fullWidth
                    className="mb-4"
                    inputProps={{ step: "0.01" }}
                />
                <FormControlLabel
                    control={
                        <Switch
                            checked={updatedSession.status}
                            onChange={handleInputChange}
                            name="status"
                            color="primary"
                        />
                    }
                    label="Statut Actif"
                    className="mb-4"
                />
                {error && (
                    <Typography color="error" className="mb-2">
                        {error}
                    </Typography>
                )}
                <Button variant="contained" onClick={handleSubmit} fullWidth>
                    Mettre à Jour
                </Button>
            </Box>
        </Modal>
    );
};

export default UpdateSessionModal;