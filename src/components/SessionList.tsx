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
    session_id: number;
    name: string;
    start_date: string;
    end_date: string;
    status: boolean;
}

const SessionList: React.FC = () => {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [open, setOpen] = useState(false);
        const [newSession, setNewSession] = useState<Session>({
            session_id: 0,
            name: '',
            start_date: '',
            end_date: '',
            status: false
        });
        const handleOpen = () => {
            setOpen(true);
        }
        const handleOpenUpdate = (session: Session) => {
            setNewSession(session);  // Remplir newSession avec les données de la session sélectionnée
            setOpenUpdate(true);
        };

        const handleClose = () => {
            setOpen(false);
        }
        const handleCloseUpdate = () => {
            setOpenUpdate(false);
        }


        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target;
            setNewSession({
                ...newSession,
                [name]: value
            });
        }
        const handleSubmitAdd = () => {
            if(newSession.name && newSession.start_date && newSession.end_date) {
                setSessions([
                    ...sessions,
                    { ...newSession, session_id: Date.now() }
                ]);
                addSession();
                setNewSession({ session_id: 0, name: '', start_date: '', end_date: '', status: false });
                handleClose();
            }
        }
        const handleSubmitUpdate = (session_id: number) => {
            if(newSession.name && newSession.start_date && newSession.end_date) {
                setSessions(sessions.map(session => {
                    if(session.session_id === session_id) {
                        return newSession;
                    }
                    return session;
                }));
                updateSession(session_id);
                setNewSession({ session_id: 0, name: '', start_date: '', end_date: '', status: false });
                handleCloseUpdate();
            }
        }

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/sessions/sessions');
                setSessions(response.data);
            } catch (error) {
                console.error('Error fetching sessions:', error);
            }
        };

        fetchSessions();
        }, []);

        const addSession = async () => {
            if(newSession.name && newSession.start_date && newSession.end_date) {
            try {
                const newSessionId = sessions.length > 0 ? sessions[sessions.length - 1].session_id + 1 : 1;
                const response = await axios.post('http://localhost:3000/api/sessions/sessions', {
                    session_id: newSessionId,
                    name: newSession.name,
                    start_date: newSession.start_date,
                    end_date: newSession.end_date,
                    status: newSession.status
                });
                setSessions([...sessions, response.data ]);
            } catch (error) {
                console.error('Error adding session:', error);
            }
        };
    }
    const updateSession = async (session_id: number) => {
        try {
            const sessionToUpdate = sessions.find(session => session.session_id === session_id);
            if (sessionToUpdate) {
                await axios.put(`http://localhost:3000/api/sessions/sessions/${session_id}`, sessionToUpdate);
            }
        } catch (error) {
            console.error('Error updating session:', error);
        }
    }

    const deleteSession = async (session_id: number) => {
        try {
            await axios.delete(`http://localhost:3000/api/sessions/sessions/${session_id}`);
            setSessions(sessions.filter(session => session.session_id !== session_id));
        } catch (error) {
            console.error('Error deleting session:', error);
        }
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
                        <div className="flex justify-center items-center mb-2">
                            <h2 className="text-xl font-semibold">{session.name}</h2>
                            <IconButton aria-label="delete" size="small" onClick={() => deleteSession(session.session_id)}>
                                <DeleteIcon />
                            </IconButton>
                            <IconButton aria-label="update" size="small" onClick={() => handleOpenUpdate(session)}>
                                <UpdateIcon />
                            </IconButton>
                        </div>
                        <p className="text-gray-600">Start Date: {new Date(session.start_date).toLocaleDateString()}</p>
                        <p className="text-gray-600">End Date: {new Date(session.end_date).toLocaleDateString()}</p>
                        <p className="text-gray-600">Status: {session.status ? 'Active' : 'Inactive'}</p>
                    </div>
                ))}
            </div>
            <Modal open={open} onClose={handleClose}>
                <Box className="bg-white p-4 rounded-lg w-96 mx-auto mt-20">
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
                        label=""
                        name="start_date"
                        type="date"
                        value={newSession.start_date}
                        onChange={handleInputChange}
                        variant="outlined"
                        fullWidth
                        className="mb-4"
                    />
                    <TextField
                        label=""
                        name="end_date"
                        type="date"
                        value={newSession.end_date}
                        onChange={handleInputChange}
                        variant="outlined"
                        fullWidth
                        className="mb-4"
                    />
                    <FormControlLabel
                        control={
                            <Switch 
                                checked={newSession.status} 
                                onChange={(e) => setNewSession({ ...newSession, status: e.target.checked })}
                                name="status"
                                color="primary"
                            />}
                        label="Active"
                    />
                    <Button variant="contained" onClick={handleSubmitAdd} fullWidth>
                        Add Session
                    </Button>
                </Box>
            </Modal>
            <Modal open={openUpdate} onClose={handleCloseUpdate}>
                <Box className="bg-white p-4 rounded-lg w-96 mx-auto mt-20">
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
                        label=""
                        name="start_date"
                        type="date"
                        value={newSession.start_date}
                        onChange={handleInputChange}
                        variant="outlined"
                        fullWidth
                        className="mb-4"
                    />
                    <TextField
                        label=""
                        name="end_date"
                        type="date"
                        value={newSession.end_date}
                        onChange={handleInputChange}
                        variant="outlined"
                        fullWidth
                        className="mb-4"
                    />
                    <FormControlLabel
                        control={
                        <Switch 
                            checked={newSession.status} 
                            onChange={(e) => setNewSession({ ...newSession, status: e.target.checked })}
                            name="status"
                            color="primary"
                        />}
                    label="Active"
                    />
                    <Button variant="contained" onClick={() => handleSubmitUpdate(newSession.session_id)} fullWidth>
                        Update Session
                    </Button>
                </Box>
            </Modal>
        </div>
    );
}

export default SessionList;