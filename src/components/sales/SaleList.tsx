import React, { useEffect, useState } from 'react';
import {
  Button,
  Typography,
  Box,
  FormControl,
  Select,
  MenuItem,
  InputLabel
} from '@mui/material';
import { Sale, Session, Seller } from '../../types';
import {
  getAllSales,
  deleteSale,
  updateSale  // <-- NOUVEAU : fonction pour finaliser ou annuler la vente
} from '../../services/saleService';
import { getSessions } from '../../services/sessionService';
import { getSellers } from '../../services/sellerService';
import SaleCard from './SaleCard';
import AddSaleModal from './AddSaleModal';
import UpdateSaleModal from './UpdateSaleModal';

const SaleList: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [filteredSales, setFilteredSales] = useState<Sale[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);

  // Filtres
  const [selectedSession, setSelectedSession] = useState<number | 'all'>('all');
  const [selectedSeller, setSelectedSeller] = useState<number | 'all'>('all');
  const [selectedStatus, setSelectedStatus] =
    useState<'all' | 'en cours' | 'finalisé' | 'annulé'>('all');

  // ...
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [openAdd, setOpenAdd] = useState<boolean>(false);
  const [openUpdate, setOpenUpdate] = useState<boolean>(false);
  const [currentSale, setCurrentSale] = useState<Sale | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [salesData, sessionsData, sellersData] = await Promise.all([
          getAllSales(),
          getSessions(),
          getSellers()
        ]);
        setSales(salesData);
        setSessions(sessionsData);
        setSellers(sellersData);
        setFilteredSales(salesData); // par défaut, tout
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Erreur lors de la récupération des données.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filtrage combiné (session, vendeur, statut)
  const filterSales = (
    sessionId: number | 'all',
    sellerId: number | 'all',
    status: 'all' | 'en cours' | 'finalisé' | 'annulé'
  ) => {
    let filtered = [...sales];

    // Filtre session
    if (sessionId !== 'all') {
      filtered = filtered.filter(sale => sale.session_id === sessionId);
    }
    // Filtre vendeur
    if (sellerId !== 'all') {
      filtered = filtered.filter(sale =>
        sale.SaleDetails?.some(detail => detail.seller_id === sellerId)
      );
    }
    // Filtre statut
    if (status !== 'all') {
      filtered = filtered.filter(sale => sale.sale_status === status);
    }

    setFilteredSales(filtered);
  };

  // Handlers pour changer de session, vendeur et statut
  const handleSessionChange = (sessionId: number | 'all') => {
    setSelectedSession(sessionId);
    filterSales(sessionId, selectedSeller, selectedStatus);
  };
  const handleSellerChange = (sellerId: number | 'all') => {
    setSelectedSeller(sellerId);
    filterSales(selectedSession, sellerId, selectedStatus);
  };
  const handleStatusChange = (newStatus: 'all' | 'en cours' | 'finalisé' | 'annulé') => {
    setSelectedStatus(newStatus);
    filterSales(selectedSession, selectedSeller, newStatus);
  };

  // Ajouter une vente
  const handleAddSale = (newSale: Sale) => {
    setSales(prev => [...prev, newSale]);
    // Vérifier le filtrage
    // => On check si newSale correspond aux filtres en cours
    const matchesSession =
      selectedSession === 'all' || newSale.session_id === selectedSession;
    const matchesSeller =
      selectedSeller === 'all' ||
      newSale.SaleDetails?.some(detail => detail.seller_id === selectedSeller);
    const matchesStatus =
      selectedStatus === 'all' || newSale.sale_status === selectedStatus;

    if (matchesSession && matchesSeller && matchesStatus) {
      setFilteredSales(prev => [...prev, newSale]);
    }
  };

  // Mettre à jour une vente (par ex. quand on modifie sale_status ou autre)
  const handleUpdateSale = (updatedSale: Sale) => {
    // Mettre à jour le tableau principal
    setSales(prev =>
      prev.map(sale =>
        sale.sale_id === updatedSale.sale_id ? updatedSale : sale
      )
    );

    // Vérifier s’il correspond toujours aux filtres
    let newFiltered = filteredSales.map(sale =>
      sale.sale_id === updatedSale.sale_id ? updatedSale : sale
    );
    // Filtre sur le nouveau status / session / seller
    // => On peut soit re-appeler filterSales(...), ou on applique la logique ici
    newFiltered = newFiltered.filter(sale => {
      // session
      if (selectedSession !== 'all' && sale.session_id !== selectedSession) {
        return false;
      }
      // seller
      if (
        selectedSeller !== 'all' &&
        !sale.SaleDetails?.some(detail => detail.seller_id === selectedSeller)
      ) {
        return false;
      }
      // status
      if (selectedStatus !== 'all' && sale.sale_status !== selectedStatus) {
        return false;
      }
      return true;
    });

    setFilteredSales(newFiltered);
  };

  // Supprimer une vente
  const handleDeleteSale = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette vente ?')) {
      try {
        await deleteSale(id);
        setSales(prev => prev.filter(sale => sale.sale_id !== id));
        setFilteredSales(prev => prev.filter(sale => sale.sale_id !== id));
        setError(null);
      } catch (err) {
        console.error('Error deleting sale:', err);
        setError('Échec de la suppression de la vente.');
      }
    }
  };

  // Finaliser une vente (passer de 'en cours' à 'finalisé')
  const handleFinalizeSale = async (sale: Sale) => {
    try {
      // On appelle updateSale depuis saleService
      // Par ex. updateSale(sale.sale_id!, { sale_status: 'finalisé' });
      const updatedSale = await updateSale(sale.sale_id!, {
        sale_status: 'finalisé'
      });
      handleUpdateSale(updatedSale);
    } catch (err) {
      console.error('Error finalizing sale:', err);
      setError('Impossible de finaliser la vente.');
    }
  };

  if (loading) {
    return <Typography className="text-center mt-10">Chargement...</Typography>;
  }

  return (
    <Box className="container mx-auto p-6 space-y-8">
      <Box className="flex justify-between items-center">
        <Typography variant="h4" className="font-bold text-gray-800">
          Liste des Ventes
        </Typography>
        <button
          onClick={() => setOpenAdd(true)}
          className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-full shadow-lg transition duration-300"
        >
          + Nouvelle Vente
        </button>
      </Box>

      <Box className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Sélecteur session */}
        <FormControl fullWidth>
          <InputLabel id="session-select-label">Session</InputLabel>
          <Select
            labelId="session-select-label"
            value={selectedSession}
            label="Session"
            onChange={(e) => handleSessionChange(e.target.value as number | 'all')}
          >
            <MenuItem value="all">Toutes les Sessions</MenuItem>
            {sessions.map(session => (
              <MenuItem key={session.session_id} value={session.session_id}>
                {session.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Sélecteur vendeur */}
        <FormControl fullWidth>
          <InputLabel id="seller-select-label">Vendeur</InputLabel>
          <Select
            labelId="seller-select-label"
            value={selectedSeller}
            label="Vendeur"
            onChange={(e) => handleSellerChange(e.target.value as number | 'all')}
          >
            <MenuItem value="all">Tous les Vendeurs</MenuItem>
            {sellers.map(seller => (
              <MenuItem key={seller.seller_id} value={seller.seller_id}>
                {seller.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Sélecteur statut */}
        <FormControl fullWidth>
          <InputLabel id="status-select-label">Statut</InputLabel>
          <Select
            labelId="status-select-label"
            value={selectedStatus}
            label="Statut"
            onChange={(e) =>
              handleStatusChange(
                e.target.value as 'all' | 'en cours' | 'finalisé' | 'annulé'
              )
            }
          >
            <MenuItem value="all">Tous</MenuItem>
            <MenuItem value="en cours">En Cours</MenuItem>
            <MenuItem value="finalisé">Finalisé</MenuItem>
            <MenuItem value="annulé">Annulé</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {error && (
        <Typography className="text-center text-red-500 mt-4">
          {error}
        </Typography>
      )}

      <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSales.length > 0 ? (
          filteredSales.map(sale => (
            <SaleCard
              key={sale.sale_id}
              sale={sale}
              onDelete={handleDeleteSale}
              onUpdate={handleUpdateSale}
              onFinalize={() => handleFinalizeSale(sale)} // <-- pour finaliser
              seller={sellers.find(seller =>
                sale.SaleDetails?.some(detail => detail.seller_id === seller.seller_id)
              )}
            />
          ))
        ) : (
          <Typography className="text-center col-span-full" variant="h6">
            Aucune vente disponible.
          </Typography>
        )}
      </Box>

      {/* Modal : Ajouter une vente */}
      <AddSaleModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onAdd={handleAddSale}
      />

      {/* Modal : UpdateSaleModal, si besoin */}
      {currentSale && (
        <UpdateSaleModal
          open={openUpdate}
          onClose={() => setOpenUpdate(false)}
          sale={currentSale}
          onUpdate={handleUpdateSale}
        />
      )}
    </Box>
  );
};

export default SaleList;