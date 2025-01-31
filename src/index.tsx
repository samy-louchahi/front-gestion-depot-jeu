import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Homepage from './pages/DashBoardPage';
import SellerPage from './pages/SellerPage';
import BuyerList from './components/buyers/BuyerList';
import SessionList from './components/session/SessionList';
import GamesList from './components/games/GameList';
//import GestionDeDepots from './components/deposit/GestionDepots';
import reportWebVitals from './reportWebVitals';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


reportWebVitals();
