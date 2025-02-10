import React, { useState } from 'react';
import { Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { Deposit, DepositGame } from '../../types';
import { formatCurrency } from '../../utils/formatCurrency';
import jsPDF from 'jspdf';

interface DepositCardProps {
  deposit: Deposit;
  onDelete: (id: number) => void;
  onUpdate: (deposit: Deposit) => void;
}

const DepositCard: React.FC<DepositCardProps> = ({ deposit, onDelete, onUpdate }) => {
  // Fonction pour générer l’étiquette sous forme de PDF
  const generatePdf = () => {
    const doc = new jsPDF();

    // Titre
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Étiquette de Dépôt', 10, 20);

    // Informations principales
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Étiquette : ${deposit.tag || 'N/A'}`, 10, 35);
    doc.text(`Dépôt ID : ${deposit.deposit_id}`, 10, 45);
    doc.text(`Vendeur : ${deposit.Seller?.name || 'N/A'}`, 10, 55);
    doc.text(`Date de dépôt : ${new Date(deposit.deposit_date).toLocaleDateString()}`, 10, 65);

    // Section des jeux déposés
    doc.setFont('helvetica', 'bold');
    doc.text('Jeux Déposés :', 10, 80);
    let yOffset = 90; // Position initiale pour lister les jeux

    deposit.DepositGames?.forEach((game, index) => {
      const gameName = game.Game?.name || 'N/A';
      const quantity = Object.keys(game.exemplaires || {}).length;
      doc.setFont('helvetica', 'normal');
      doc.text(`${index + 1}. ${gameName} - Quantité : ${quantity}`, 10, yOffset);
      yOffset += 10;
    });

    // Téléchargement du fichier
    doc.save(`etiquette-depot-${deposit.deposit_id}.pdf`);
  };

  return (
    <Box className="bg-white shadow-md rounded-lg p-8 space-y-6 border border-gray-300">
      <Box className="flex justify-between items-center">
        <Typography variant="h6" className="font-bold text-gray-800">
          Dépôt #{deposit.deposit_id}
        </Typography>
        <Typography variant="body2" className="text-gray-600">
          {new Date(deposit.deposit_date).toLocaleDateString()}
        </Typography>
      </Box>

      <Box className="text-gray-800 space-y-1">
        <Typography variant="body1" className="font-medium">
          Vendeur : {deposit.Seller?.name || 'N/A'}
        </Typography>
        <Typography variant="body2">
          Réduction des frais : {deposit.discount_fees ? `${deposit.discount_fees}%` : 'N/A'}
        </Typography>
        <Typography variant="body2" className="font-bold text-indigo-600">
          Étiquette de dépôt : {deposit.tag || 'N/A'}
        </Typography>
      </Box>

      <Typography variant="h6" className="mt-4 font-semibold">
        Jeux Déposés
      </Typography>
      <TableContainer component={Paper} className="rounded-lg">
        <Table>
          <TableHead>
            <TableRow className="bg-gray-200">
              <TableCell className="font-bold">Jeu</TableCell>
              <TableCell align="right" className="font-bold">Frais (%)</TableCell>
              <TableCell align="right" className="font-bold">Quantité</TableCell>
              <TableCell align="right" className="font-bold">Prix Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deposit.DepositGames?.map((dg: DepositGame) => {
              const exemplaires = dg.exemplaires ? Object.values(dg.exemplaires) : [];
              const quantity = exemplaires.length;
              const totalPrice = exemplaires.reduce((sum, ex) => sum + ex.price, 0);

              return (
                <TableRow key={dg.deposit_game_id} className="hover:bg-gray-50 transition">
                  <TableCell>{dg.Game?.name || 'N/A'}</TableCell>
                  <TableCell align="right">{dg.fees}%</TableCell>
                  <TableCell align="right">{quantity}</TableCell>
                  <TableCell align="right">{formatCurrency(totalPrice)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Bouton pour générer l’étiquette */}
      <Box className="flex justify-end mt-4">
        <Button variant="contained" color="primary" onClick={generatePdf}>
          Télécharger l’étiquette
        </Button>
      </Box>
    </Box>
  );
};

export default DepositCard;