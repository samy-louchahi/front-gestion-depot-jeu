import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SellerPage from './pages/SellerPage';
import BuyerPage from './pages/BuyerPage';
import GamePage from './pages/GamePage';
import DashboardPage from './pages/DashBoardPage';
import SessionPage from './pages/SessionPage';
import DepositPage from './pages/DepositPage';
import SalePage from './pages/SalePage';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoutes';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { useContext } from 'react';

const App: React.FC = () => {
    return (
        <AuthProvider>
            <Router>
                <nav className="bg-white shadow-lg">
                    <div className="container mx-auto px-4">
                        <div className="flex justify-between items-center py-4">
                            <Link to="/" className="text-2xl font-bold text-blue-600">
                                Gestion de Jeux
                            </Link>
                            <NavigationButtons />
                            <AuthButtons />
                        </div>
                    </div>
                </nav>

                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
                    <Route path="/sellers" element={<PrivateRoute><SellerPage /></PrivateRoute>} />
                    <Route path="/buyers" element={<PrivateRoute><BuyerPage /></PrivateRoute>} />
                    <Route path="/games" element={<PrivateRoute><GamePage /></PrivateRoute>} />
                    <Route path="/sessions" element={<PrivateRoute><SessionPage /></PrivateRoute>} />
                    <Route path="/deposits" element={<PrivateRoute><DepositPage /></PrivateRoute>} />
                    <Route path="/sales" element={<PrivateRoute><SalePage /></PrivateRoute>} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

const NavigationButtons: React.FC = () => {
    const { user } = useContext(AuthContext);

    if (!user) return null;

    return (
        <div className="flex space-x-6">
            <NavLink to="/">Dashboard</NavLink>
            <NavLink to="/sellers">Vendeurs</NavLink>
            <NavLink to="/buyers">Acheteurs</NavLink>
            <NavLink to="/games">Jeux</NavLink>
            <NavLink to="/sessions">Session</NavLink>
            <NavLink to="/deposits">Dépôt</NavLink>
            <NavLink to="/sales">Vente</NavLink>
        </div>
    );
};

const NavLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => {
    return (
        <Link
            to={to}
            className="text-gray-700 hover:text-blue-500 transition duration-300 font-medium"
        >
            {children}
        </Link>
    );
};

const AuthButtons: React.FC = () => {
    const { user, logout } = useContext(AuthContext);

    return user ? (
        <div className="flex items-center space-x-4">
            <span className="text-gray-700 font-medium">
                {user.role === 'admin' ? 'Admin' : 'Gestionnaire'}
            </span>
            <button
                onClick={logout}
                 className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-full shadow-lg transition duration-300"
            >
                Déconnexion
            </button>
        </div>
    ) : (
        <Link
            to="/login"
             className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-full shadow-lg transition duration-300"
        >
            Connexion
        </Link>
    );
};

export default App;