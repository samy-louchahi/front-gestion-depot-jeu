import React, { useEffect, useState } from 'react';
import { GlobalBalanceResponse } from '../../services/statisticService';
import { getGlobalBalanceBySession } from '../../services/sessionService';
import { formatCurrency } from '../../utils/formatCurrency';
import { Box, CircularProgress } from '@mui/material';

interface FinancialSummaryCardsProps {
  sessionId?: number;
}

const FinancialSummaryCards: React.FC<FinancialSummaryCardsProps> = ({ sessionId }) => {
  const [balance, setBalance] = useState<GlobalBalanceResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      setLoading(true);
      try {
        const data = await getGlobalBalanceBySession(sessionId ? sessionId : 0);
        setBalance(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Erreur lors de la récupération des données financières.');
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [sessionId]);

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-20">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <p className="text-center text-red-600">{error}</p>
    );
  }

  if (!balance) {
    return null;
  }

  // Cartes à afficher
  const cards = [
    { title: 'Chiffre des ventes', value: balance.totalSales },
    { title: 'Commissions encaissées', value: balance.totalCommission },
    { title: 'Frais de dépôt encaissés', value: balance.totalDepositFees },
    { title: 'Bénéfice net', value: balance.totalBenef }
  ];

  return (
    <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Box
          key={index}
          className="p-6 bg-white rounded-lg shadow-md border border-gray-200 text-center transition-transform transform hover:scale-105"
        >
          <h3 className="text-lg font-semibold text-gray-700 truncate max-w-full">
            {card.title}
          </h3>
          <p className="text-2xl sm:text-3xl font-bold text-indigo-600 mt-2">
            {formatCurrency(card.value)}
          </p>
        </Box>
      ))}
    </Box>
  );
};

export default FinancialSummaryCards;