// src/components/sessions/AddSessionModal.tsx

import React, { useState } from 'react';
import { Modal, Box, TextField, Typography, Button } from '@mui/material';

interface AddSessionModalProps {
    open: boolean;
    onClose: () => void;
    onAdd: (session: Omit<Session, 'session_id' | 'status'>) => void;
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

const AddSessionModal: React.FC<AddSessionModalProps> = ({ open, onClose, onAdd }) => {
    const [session, setSession] = useState<Omit<Session, 'session_id' | 'status'>>({
        name: '',
        start_date: '',
        end_date: '',
        fees: 0,
        commission: 0
    });

    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        let newValue: any = value;

        if (type === 'number') {
            newValue = parseFloat(value);
        }

        setSession({
            ...session,
            [name]: newValue
        });
    };

    const handleSubmit = () => {
        const { name, start_date, end_date, fees, commission } = session;

        // Validation des champs
        if (!name || !start_date || !end_date) {
            setError('Veuillez remplir tous les champs requis.');
            return;
        }

        onAdd(session);
        setSession({
            name: '',
            start_date: '',
            end_date: '',
            fees: 0,
            commission: 0
        });
        setError(null);
        onClose();
    };

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
                    Créer une Session
                </Typography>
                <TextField
                    label="Nom"
                    name="name"
                    value={session.name}
                    onChange={handleInputChange}
                    variant="outlined"
                    fullWidth
                    className="mb-4"
                />
                <TextField
                    label="Date de Début"
                    name="start_date"
                    type="date"
                    value={session.start_date}
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
                    value={session.end_date}
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
                    value={session.fees}
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
                    value={session.commission}
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
                    Ajouter
                </Button>
            </Box>
        </Modal>
    );
};

export default AddSessionModal;