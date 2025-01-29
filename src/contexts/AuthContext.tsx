// src/contexts/AuthContext.tsx

import React, { createContext, useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';

interface User {
    id: number;
    email: string;
    username: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    login: (token: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    login: () => {},
    logout: () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded: any = jwt_decode(token);
                setUser({
                    id: decoded.id,
                    email: decoded.email,
                    username: decoded.username,
                    role: decoded.role
                });
                console.log('AuthContext - Utilisateur chargé:', decoded);
                console.log('AuthContext - Utilisateur:', user);
            } catch (error) {
                console.error('AuthContext - Token invalide');
                localStorage.removeItem('token');
            }
        }
    }, []);

    const login = (token: string) => {
        localStorage.setItem('token', token);
        try {
            const decoded: any = jwt_decode(token);
            setUser({
                id: decoded.id,
                email: decoded.email,
                username: decoded.username,
                role: decoded.role
            });
            console.log('AuthContext - Utilisateur connecté:', decoded);
        } catch (error) {
            console.error('AuthContext - Token invalide lors du login');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        console.log('AuthContext - Utilisateur déconnecté');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};