// src/pages/DashboardPage.tsx

import React from 'react';
import { Typography } from '@mui/material';

const Homepage: React.FC = () => {
    return (
        <div style={{ padding: '2rem' }}>
            <Typography variant="h4" gutterBottom>
                Bienvenue sur le Dashboard
            </Typography>
            <Typography variant="body1">
                Utilisez la barre de navigation pour gérer les vendeurs, acheteurs, jeux et dépôts.
            </Typography>
        </div>
    );
};

export default Homepage;