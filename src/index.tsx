import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Homepage from './pages/Homepage';
import SellerList from './components/sellers/SellerList';
import BuyerList from './components/buyers/BuyerList';
import SessionList from './components/session/SessionList';
import GamesList from './components/games/GamesList';
import GestionDeDepots from './components/deposit/GestionDepots';
import reportWebVitals from './reportWebVitals';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
   <SellerList />
    <Homepage />
    <BuyerList />
    <Homepage />
    <SessionList />
    <Homepage />
    <GamesList />
    <Homepage />
    <GestionDeDepots />
  </React.StrictMode>
);


reportWebVitals();
