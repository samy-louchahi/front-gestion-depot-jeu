import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import {api} from '../services/api';

const Login: React.FC = () => {
    const [role, setRole] = useState<'admin' | 'gestionnaire'>('admin');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setRole(e.target.value as 'admin' | 'gestionnaire');
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200">
            <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
                <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Connexion</h2>

                {error && (
                    <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4">
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="role">
                            Rôle
                        </label>
                        <select
                            id="role"
                            value={role}
                            onChange={handleRoleChange}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="admin">Admin</option>
                            <option value="gestionnaire">Gestionnaire</option>
                        </select>
                    </div>

                    {role === 'admin' ? (
                        <div>
                            <label className="block text-gray-700 font-medium mb-2" htmlFor="email">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                required
                            />
                        </div>
                    ) : (
                        <div>
                            <label className="block text-gray-700 font-medium mb-2" htmlFor="username">
                                Nom d'utilisateur
                            </label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                required
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="password">
                            Mot de passe
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition duration-300"
                    >
                        Se Connecter
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;