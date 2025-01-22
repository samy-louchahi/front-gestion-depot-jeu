import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateIcon from '@mui/icons-material/Update';
import { Modal, Box, TextField, Typography, Switch } from '@mui/material';
import { FormControlLabel } from '@mui/material';
import axios from 'axios';

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
    const [openUpdate, setOpenUpdate] = useState(false);
    const [open, setOpen] = useState(false);
    const [newSession, setNewSession] = useState<Session>({
        name: '',
        start_date: '',
        end_date: '',
        status: false,
        fees: 0,
        commission: 0
    });

    const handleOpen = () => {
        setNewSession({
            name: '',
            start_date: '',
            end_date: '',
            status: false,
            fees: 0,
            commission: 0
        });
        setOpen(true);
    }

    const handleOpenUpdate = (session: Session) => {
        setNewSession(session);
        setOpenUpdate(true);
    };

    const handleClose = () => {
        setOpen(false);
    }

    const handleCloseUpdate = () => {
        setOpenUpdate(false);
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        let newValue: any = value;

        if (type === 'number') {
            newValue = parseFloat(value);
        } else if (type === 'checkbox') {
            newValue = checked;
        }

        setNewSession({
            ...newSession,
            [name]: newValue
        });
    }

    const handleSubmitAdd = async () => {
        const { name, start_date, end_date, status, fees, commission } = newSession;

        // Validation des champs
        if (!name || !start_date || !end_date) {
            setError('Please fill in all required fields.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/api/sessions', {
                name,
                start_date,
                end_date,
                status,
                fees,
                commission
            });

            setSessions([...sessions, response.data]);
            setNewSession({
                name: '',
                start_date: '',
                end_date: '',
                status: false,
                fees: 0,
                commission: 0
            });
            handleClose();
            setError(null);
        } catch (error) {
            console.error('Error adding session:', error);
            setError('Failed to add session.');
        }
    }

    const handleSubmitUpdate = async (session_id: number) => {
        const { name, start_date, end_date, status, fees, commission } = newSession;

        // Validation des champs
        if (!name || !start_date || !end_date) {
            setError('Please fill in all required fields.');
            return;
        }

        try {
            const response = await axios.put(`http://localhost:3000/api/sessions/${session_id}`, {
                name,
                start_date,
                end_date,
                status,
                fees,
                commission
            });

            setSessions(sessions.map(session => session.session_id === session_id ? response.data : session));
            setNewSession({
                name: '',
                start_date: '',
                end_date: '',
                status: false,
                fees: 0,
                commission: 0
            });
            handleCloseUpdate();
            setError(null);
        } catch (error) {
            console.error('Error updating session:', error);
            setError('Failed to update session.');
        }
    }

    const deleteSession = async (session_id: number) => {
        try {
            await axios.delete(`http://localhost:3000/api/sessions/${session_id}`);
            setSessions(sessions.filter(session => session.session_id !== session_id));
            setError(null);
        } catch (error) {
            console.error('Error deleting session:', error);
            setError('Failed to delete session.');
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
                setError('Failed to fetch sessions.');
                setLoading(false);
            }
        };

        fetchSessions();
    }, []);

    if (loading) {
        return <div className="text-center mt-10">Loading...</div>;
    }

    if (error) {
        return <div className="text-center mt-10 text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <div className="text-center mb-4">
                <h1 className="text-2xl font-bold mb-4">Session List</h1>
                <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
                    Add Session
                </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {sessions.map(session => (
                    <div key={session.session_id} className="bg-white shadow-md rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-xl font-semibold">{session.name}</h2>
                            <div>
                                <IconButton aria-label="update" size="small" onClick={() => handleOpenUpdate(session)}>
                                    <UpdateIcon />
                                </IconButton>
                                <IconButton aria-label="delete" size="small" onClick={() => deleteSession(session.session_id!)}>
                                    <DeleteIcon />
                                </IconButton>
                            </div>
                        </div>
                        <p className="text-gray-600">Start Date: {new Date(session.start_date).toLocaleDateString()}</p>
                        <p className="text-gray-600">End Date: {new Date(session.end_date).toLocaleDateString()}</p>
                        <p className="text-gray-600">Fees: {session.fees} %</p>
                        <p className="text-gray-600">Commission: {session.commission} %</p>
                        <p className="text-gray-600">Status: {session.status ? 'Active' : 'Inactive'}</p>
                    </div>
                ))}
            </div>

            {/* Add Session Modal */}
            <Modal open={open} onClose={handleClose}>
                <Box className="bg-white p-6 rounded-lg w-full max-w-md mx-auto mt-20">
                    <Typography variant="h4" className="text-center mb-4">Add Session</Typography>
                    <TextField
                        label="Name"
                        name="name"
                        value={newSession.name}
                        onChange={handleInputChange}
                        variant="outlined"
                        fullWidth
                        className="mb-4"
                    />
                    <TextField
                        label="Start Date"
                        name="start_date"
                        type="date"
                        value={newSession.start_date}
                        onChange={handleInputChange}
                        variant="outlined"
                        fullWidth
                        className="mb-4"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        label="End Date"
                        name="end_date"
                        type="date"
                        value={newSession.end_date}
                        onChange={handleInputChange}
                        variant="outlined"
                        fullWidth
                        className="mb-4"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField 
                        label="Fees"
                        name="fees"
                        type="number"
                        value={newSession.fees}
                        onChange={handleInputChange}
                        variant="outlined"
                        fullWidth
                        className="mb-4"
                        inputProps={{ step: "0.01" }}
                    />
                    <TextField 
                        label="Commission"
                        name="commission"
                        type="number"
                        value={newSession.commission}
                        onChange={handleInputChange}
                        variant="outlined"
                        fullWidth
                        className="mb-4"
                        inputProps={{ step: "0.01" }}
                    />
                    <FormControlLabel
                        control={
                            <Switch 
                                checked={newSession.status} 
                                onChange={(e) => setNewSession({ ...newSession, status: e.target.checked })}
                                name="status"
                                color="primary"
                            />
                        }
                        label="Active"
                        className="mb-4"
                    />
                    <Button variant="contained" onClick={handleSubmitAdd} fullWidth>
                        Add Session
                    </Button>
                </Box>
            </Modal>

            {/* Update Session Modal */}
            <Modal open={openUpdate} onClose={handleCloseUpdate}>
                <Box className="bg-white p-6 rounded-lg w-full max-w-md mx-auto mt-20">
                    <Typography variant="h4" className="text-center mb-4">Update Session</Typography>
                    <TextField
                        label="Name"
                        name="name"
                        value={newSession.name}
                        onChange={handleInputChange}
                        variant="outlined"
                        fullWidth
                        className="mb-4"
                    />
                    <TextField
                        label="Start Date"
                        name="start_date"
                        type="date"
                        value={newSession.start_date}
                        onChange={handleInputChange}
                        variant="outlined"
                        fullWidth
                        className="mb-4"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        label="End Date"
                        name="end_date"
                        type="date"
                        value={newSession.end_date}
                        onChange={handleInputChange}
                        variant="outlined"
                        fullWidth
                        className="mb-4"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField 
                        label="Fees"
                        name="fees"
                        type="number"
                        value={newSession.fees}
                        onChange={handleInputChange}
                        variant="outlined"
                        fullWidth
                        className="mb-4"
                        inputProps={{ step: "0.01" }}
                    />
                    <TextField 
                        label="Commission"
                        name="commission"
                        type="number"
                        value={newSession.commission}
                        onChange={handleInputChange}
                        variant="outlined"
                        fullWidth
                        className="mb-4"
                        inputProps={{ step: "0.01" }}
                    />
                    <FormControlLabel
                        control={
                            <Switch 
                                checked={newSession.status} 
                                onChange={(e) => setNewSession({ ...newSession, status: e.target.checked })}
                                name="status"
                                color="primary"
                            />
                        }
                        label="Active"
                        className="mb-4"
                    />
                    <Button variant="contained" onClick={() => handleSubmitUpdate(newSession.session_id!)} fullWidth>
                        Update Session
                    </Button>
                </Box>
            </Modal>
        </div>
    );

}

export default SessionList;