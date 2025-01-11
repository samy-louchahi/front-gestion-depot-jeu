import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Homepage from './pages/Homepage';
import SellerList from './components/SellerList';
import BuyerList from './components/BuyerList';
import SessionList from './components/SessionList';
import GamesList from './components/GamesList';
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
  </React.StrictMode>
);


reportWebVitals();
