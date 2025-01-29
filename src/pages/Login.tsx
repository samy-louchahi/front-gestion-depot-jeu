import React, { useState, useContext } from 'react';
import { TextField, Button, Typography, Box, FormControl, InputLabel, Select, MenuItem, Alert, SelectChangeEvent } from '@mui/material';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Login: React.FC = () => {
    const [role, setRole] = useState<'admin' | 'gestionnaire'>('admin');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleRoleChange = (event: SelectChangeEvent<'admin' | 'gestionnaire'>) => {
        setRole(event.target.value as 'admin' | 'gestionnaire');
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            let response;
            if (role === 'admin') {
                if (!email || !password) {
                    setError('Veuillez remplir tous les champs.');
                    return;
                }
                response = await api.post(`/auth/admin/login`, { email, password });
            } else {
                if (!username || !password) {
                    setError('Veuillez remplir tous les champs.');
                    return;
                }
                response = await api.post(`/auth/gestionnaire/login`, { username, password });
            }

            const { token } = response.data;
            login(token); // Mettre à jour le contexte
            navigate('/');
        } catch (err: any) {
            console.error('Erreur lors du login:', err);
            setError(err.response?.data?.error || 'Erreur lors de la connexion.');
        }
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
            <Typography variant="h4" gutterBottom>
                Connexion
            </Typography>
            <form onSubmit={handleSubmit} style={{ width: '300px' }}>
                <FormControl fullWidth variant="outlined" style={{ marginBottom: '1rem' }}>
                    <InputLabel id="role-label">Rôle</InputLabel>
                    <Select labelId="role-label" label="Rôle" value={role} onChange={handleRoleChange}>
                        <MenuItem value="admin">Admin</MenuItem>
                        <MenuItem value="gestionnaire">Gestionnaire</MenuItem>
                    </Select>
                </FormControl>

                {role === 'admin' ? (
                    <TextField
                        label="Email"
                        type="email"
                        variant="outlined"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ marginBottom: '1rem' }}
                        required
                    />
                ) : (
                    <TextField
                        label="Nom d'utilisateur"
                        variant="outlined"
                        fullWidth
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{ marginBottom: '1rem' }}
                        required
                    />
                )}

                <TextField
                    label="Mot de passe"
                    type="password"
                    variant="outlined"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ marginBottom: '1rem' }}
                    required
                />

                {error && <Alert severity="error" style={{ marginBottom: '1rem' }}>{error}</Alert>}

                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Se Connecter
                </Button>
            </form>
        </Box>
    );
};

export default Login;