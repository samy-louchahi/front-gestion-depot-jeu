import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SellerPage from './pages/SellerPage';
import BuyerPage from './pages/BuyerPage';
import GamePage from './pages/GamePage';
import Homepage from './pages/Homepage';
import SessionPage from './pages/SessionPage';
import DepositPage from './pages/DepositPage';
import SalePage from './pages/SalePage';
import Login from './pages/Login';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import PrivateRoute from './components/PrivateRoutes';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { useContext } from 'react';

const App: React.FC = () => {
  const { user } = useContext(AuthContext);
    return (
        <AuthProvider>
            <Router>
                <AppBar position="static">
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" style={{ flexGrow: 1 }}>
                            Gestion de Jeux
                        </Typography>
                        <NavigationButtons />
                        <AuthButtons />
                    </Toolbar>
                </AppBar>
                </AppBar>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    {/* Routes protégées */}
                    <Route path="/" element={<PrivateRoute><Homepage /></PrivateRoute>} />
                    <Route path="/sellers" element={<PrivateRoute><SellerPage /></PrivateRoute>} />
                    <Route path="/buyers" element={<PrivateRoute><BuyerPage /></PrivateRoute>} />
                    <Route path="/games" element={<PrivateRoute><GamePage /></PrivateRoute>} />
                    <Route path="/session" element={<PrivateRoute><SessionPage /></PrivateRoute>} />
                    <Route path="/deposit" element={<PrivateRoute><DepositPage /></PrivateRoute>} />
                    <Route path="/sale" element={<PrivateRoute><SalePage /></PrivateRoute>} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

const NavigationButtons: React.FC = () => {
  const { user } = useContext(AuthContext);
  console.log('NavigationButtons - User:', user); // Pour débogage

  return user ? (
      <>
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
      </>
  ) : null;
};

const AuthButtons: React.FC = () => {
  const { user, logout } = useContext(AuthContext);

  return user ? (
      <>
          <Typography variant="body1" style={{ marginRight: '1rem' }}>
              {user.role === 'admin' ? 'Admin' : 'Gestionnaire'}
          </Typography>
          <Button color="inherit" onClick={logout}>
              Déconnexion
          </Button>
      </>
  ) : (
      <Button color="inherit" component={Link} to="/login">
          Connexion
      </Button>
  );
};

export default App;