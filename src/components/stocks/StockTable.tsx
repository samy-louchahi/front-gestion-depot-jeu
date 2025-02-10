import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Collapse, Typography } from '@mui/material';
import { Stock } from '../../types';
import { ChevronRight, ExpandMore } from '@mui/icons-material';

interface StockTableProps {
  stocks: Stock[];
}

const groupStocksByGameAndSeller = (stocks: Stock[]) => {
  const groupedByGame: {
    [gameName: string]: {
      game: string;
      gameId: number;
      sellers: { sellerName: string; initialQuantity: number; currentQuantity: number }[];
      totalInitial: number;
      totalCurrent: number;
    };
  } = {};

  stocks.forEach((stock) => {
    const gameName = stock.Game?.name || 'Jeu inconnu';
    const gameId = stock.game_id;
    const sellerName = stock.Seller?.name || 'Vendeur inconnu';

    if (!groupedByGame[gameName]) {
      groupedByGame[gameName] = {
        game: gameName,
        gameId: gameId,
        sellers: [],
        totalInitial: 0,
        totalCurrent: 0,
      };
    }

    // Trouver si le vendeur existe déjà dans la liste des vendeurs
    const existingSeller = groupedByGame[gameName].sellers.find((s) => s.sellerName === sellerName);
    if (existingSeller) {
      existingSeller.initialQuantity += stock.initial_quantity;
      existingSeller.currentQuantity += stock.current_quantity;
    } else {
      groupedByGame[gameName].sellers.push({
        sellerName: sellerName,
        initialQuantity: stock.initial_quantity,
        currentQuantity: stock.current_quantity,
      });
    }

    // Ajouter aux totaux globaux du jeu
    groupedByGame[gameName].totalInitial += stock.initial_quantity;
    groupedByGame[gameName].totalCurrent += stock.current_quantity;
  });

  return Object.values(groupedByGame);
};

const StockTable: React.FC<StockTableProps> = ({ stocks }) => {
  const [expandedRows, setExpandedRows] = useState<{ [key: number]: boolean }>({});

  const groupedStocks = groupStocksByGameAndSeller(stocks);

  const toggleRowExpansion = (gameId: number) => {
    setExpandedRows((prev) => ({
      ...prev,
      [gameId]: !prev[gameId],
    }));
  };

  return (
    <TableContainer component={Paper} className="p-4">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell><strong>Jeu</strong></TableCell>
            <TableCell align="center"><strong>Quantité Initiale Totale</strong></TableCell>
            <TableCell align="center"><strong>Quantité Actuelle Totale</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {groupedStocks.map((group) => (
            <React.Fragment key={group.gameId}>
              {/* Ligne principale du jeu */}
              <TableRow>
                <TableCell>
                  <IconButton onClick={() => toggleRowExpansion(group.gameId)}>
                    {expandedRows[group.gameId] ? <ExpandMore /> : <ChevronRight />}
                  </IconButton>
                </TableCell>
                <TableCell>
                  <Typography className="font-semibold">{group.game}</Typography>
                </TableCell>
                <TableCell align="center">{group.totalInitial}</TableCell>
                <TableCell align="center">{group.totalCurrent}</TableCell>
              </TableRow>

              {/* Lignes détaillées par vendeur */}
              <TableRow>
                <TableCell colSpan={4} style={{ paddingBottom: 0, paddingTop: 0 }}>
                  <Collapse in={expandedRows[group.gameId]} timeout="auto" unmountOnExit>
                    <Table size="small" className="ml-8">
                      <TableHead>
                        <TableRow>
                          <TableCell><strong>Vendeur</strong></TableCell>
                          <TableCell align="center"><strong>Quantité Initiale</strong></TableCell>
                          <TableCell align="center"><strong>Quantité Actuelle</strong></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {group.sellers.map((seller, index) => (
                          <TableRow key={index}>
                            <TableCell>{seller.sellerName}</TableCell>
                            <TableCell align="center">{seller.initialQuantity}</TableCell>
                            <TableCell align="center">{seller.currentQuantity}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Collapse>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default StockTable;