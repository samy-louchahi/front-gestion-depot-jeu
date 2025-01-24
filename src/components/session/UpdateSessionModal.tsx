// src/components/sessions/UpdateSessionModal.tsx

import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Typography, Button } from '@mui/material';

interface UpdateSessionModalProps {
    open: boolean;
    onClose: () => void;
    onUpdate: (session: Session) => void;
    session: Session | null;
}

interface Session {
    session_id?: number;
    name: string;
    start_date: string;
    end_date: string;
    status: boolean;
    fees: number;
    commission: number;
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

    const handleSubmit = () => {
        const { name, start_date, end_date, fees, commission } = updatedSession;

        // Validation des champs
        if (!name || !start_date || !end_date) {
            setError('Veuillez remplir tous les champs requis.');
            return;
        }

        onUpdate(updatedSession);
        setError(null);
        onClose();
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