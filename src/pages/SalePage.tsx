import React, { useState, useEffect } from "react";
import SaleList from "../components/sales/SaleList";
import { Button, Typography, Box } from "@mui/material";
import { ShoppingBagIcon } from "@heroicons/react/outline";
import { getAllSales } from "../services/saleService";
import { Sale } from "../types";

const SalePage: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const data = await getAllSales();
        setSales(data);
      } catch (err) {
        console.error("Erreur lors de la récupération des ventes :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  return (
    <Box className="p-8 space-y-6">
      <Typography variant="h4" className="text-center font-bold text-gray-800">
        Gestion des Ventes
      </Typography>

      {loading ? (
        <Typography className="text-center text-gray-500">
          Chargement des ventes...
        </Typography>
      ) : sales.length === 0 ? (
        <Box className="flex flex-col items-center justify-center space-y-4 p-10 bg-white rounded-lg shadow-md">
          <ShoppingBagIcon className="w-16 h-16 text-indigo-500" />
          <Typography className="text-2xl font-semibold text-gray-800">
            Aucune vente trouvée
          </Typography>
          <Typography className="text-gray-600">
            Enregistrez une nouvelle vente pour commencer à suivre les transactions.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<ShoppingBagIcon className="w-5 h-5" />}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Enregistrer une vente
          </Button>
        </Box>
      ) : (
        <SaleList />
      )}
    </Box>
  );
};

export default SalePage;