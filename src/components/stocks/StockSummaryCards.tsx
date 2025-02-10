import React from 'react';
import { Box, Typography } from '@mui/material';
import { Stock } from '../../types';
import { calculateStockSummary } from '../../utils/stockUtils';

interface StockSummaryCardsProps {
  stocks: Stock[];
}

const StockSummaryCards: React.FC<StockSummaryCardsProps> = ({ stocks }) => {
  const { totalGames, totalInStock, totalSold } = calculateStockSummary(stocks);

  const cards = [
    { title: 'Total des jeux déposés', value: totalGames },
    { title: 'Jeux en stock', value: totalInStock },
    { title: 'Jeux vendus', value: totalSold },
  ];

  return (
    <Box className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card, index) => (
        <Box
          key={index}
          className="p-6 bg-white rounded-lg shadow-md border border-gray-200 text-center"
        >
          <Typography variant="h6" className="font-semibold text-gray-700">
            {card.title}
          </Typography>
          <Typography variant="h4" className="font-bold text-indigo-600 mt-2">
            {card.value}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default StockSummaryCards;