import { Stock } from '../types';

export const calculateStockSummary = (stocks: Stock[]) => {
  const totalGames = stocks.length;
  let totalInStock = 0;
  let totalSold = 0;

  stocks.forEach((stock) => {
    totalInStock += stock.current_quantity;
    totalSold += stock.initial_quantity - stock.current_quantity;
  });
  return { totalGames, totalInStock, totalSold };
};