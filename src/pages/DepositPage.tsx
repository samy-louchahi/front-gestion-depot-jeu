import React, { useState, useEffect } from "react";
import DepositList from "../components/deposit/DepositList";
import { Button, Typography, Box } from "@mui/material";
import { DocumentAddIcon } from "@heroicons/react/outline";
import { getAllDeposits } from "../services/depositService";
import { Deposit } from "../types";

const DepositPage: React.FC = () => {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDeposits = async () => {
      try {
        const data = await getAllDeposits();
        setDeposits(data);
      } catch (err) {
        console.error("Erreur lors de la récupération des dépôts :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDeposits();
  }, []);

  return (
    <Box className="p-8 space-y-6">
      <Typography variant="h4" className="text-center font-bold text-gray-800">
        Gestion des Dépôts
      </Typography>

      {loading ? (
        <Typography className="text-center text-gray-500">
          Chargement des dépôts...
        </Typography>
      ) : deposits.length === 0 ? (
        <Box className="flex flex-col items-center justify-center space-y-4 p-10 bg-white rounded-lg shadow-md">
          <Typography className="text-2xl font-semibold text-gray-800">
            Aucun dépôt trouvé
          </Typography>
          <Typography className="text-gray-600">
            Enregistrez vos premiers dépôts pour les gérer facilement.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<DocumentAddIcon className="w-5 h-5" />}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Ajouter un dépôt
          </Button>
        </Box>
      ) : (
        <DepositList />
      )}
    </Box>
  );
};

export default DepositPage;