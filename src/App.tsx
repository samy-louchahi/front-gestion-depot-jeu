// src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SellerPage from './pages/SellerPage';
import BuyerPage from './pages/BuyerPage';
import GamePage from './pages/GamePage';
import Homepage from './pages/Homepage'; // Si nécessaire
import SessionPage from './pages/SessionPage';
import DepositPage from './pages/DepositPage';
import SalePage from './pages/SalePage';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

const App: React.FC = () => {
    return (
        <Router>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" style={{ flexGrow: 1 }}>
                        Gestion de Jeux
                    </Typography>
                    <Button color="inherit" component={Link} to="/">
                        Accueil
                    </Button>
                    <Button color="inherit" component={Link} to="/sellers">
                        Vendeurs
                    </Button>
                    <Button color="inherit" component={Link} to="/buyers">
                        Acheteurs
                    </Button>
                    <Button color="inherit" component={Link} to="/games">
                        Jeux
                    </Button>
                    <Button color="inherit" component={Link} to="/session">
                      Session
                    </Button>
                    <Button color="inherit" component={Link} to="/deposit">
                      Dépôt
                    </Button>
                    <Button color="inherit" component={Link} to="/sale">
                      Vente
                    </Button>
                    
                </Toolbar>
            </AppBar>
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/sellers" element={<SellerPage />} />
                <Route path="/buyers" element={<BuyerPage />} />
                <Route path="/games" element={<GamePage />} />
                <Route path='/session' element={<SessionPage />} />
                <Route path='/deposit' element={<DepositPage />} />
                <Route path='/sale' element={<SalePage />} />
            </Routes>
        </Router>
    );
};

export default App;