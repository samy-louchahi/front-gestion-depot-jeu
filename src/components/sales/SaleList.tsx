import React, { useEffect, useState } from 'react';
import { Button, Typography, Box, FormControl, Select, MenuItem, InputLabel } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Sale, Session, Seller } from '../../types';
import { getAllSales, deleteSale } from '../../services/saleService';
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
    const [selectedSession, setSelectedSession] = useState<number | 'all'>('all');
    const [selectedSeller, setSelectedSeller] = useState<number | 'all'>('all');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [openAdd, setOpenAdd] = useState<boolean>(false);
    const [openUpdate, setOpenUpdate] = useState<boolean>(false);
    const [currentSale, setCurrentSale] = useState<Sale | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [salesData, sessionsData, sellersData] = await Promise.all([
                    getAllSales(),
                    getSessions(),
                    getSellers(),
                ]);
                setSales(salesData);
                setSessions(sessionsData);
                setSellers(sellersData);
                setFilteredSales(salesData);
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

    const handleSessionChange = (sessionId: number | 'all') => {
        setSelectedSession(sessionId);
        filterSales(sessionId, selectedSeller);
    };

    const handleSellerChange = (sellerId: number | 'all') => {
        setSelectedSeller(sellerId);
        filterSales(selectedSession, sellerId);
    };

    const filterSales = (sessionId: number | 'all', sellerId: number | 'all') => {
        let filtered = [...sales];

        if (sessionId !== 'all') {
            filtered = filtered.filter(sale => sale.session_id === sessionId);
        }
        if (sellerId !== 'all') {
            filtered = filtered.filter(sale => 
                sale.SaleDetails?.some(detail => detail.seller_id === sellerId)
            );
        }

        setFilteredSales(filtered);
    };

    const handleAddSale = (newSale: Sale) => {
        setSales(prev => [...prev, newSale]);
        if (
            (selectedSession === 'all' || newSale.session_id === selectedSession) &&
            (selectedSeller === 'all' || 
             newSale.SaleDetails?.some(detail => detail.seller_id === selectedSeller))
        ) {
            setFilteredSales(prev => [...prev, newSale]);
        }
    };

    const handleUpdateSale = (updatedSale: Sale) => {
        setSales(prev =>
            prev.map(sale => (sale.sale_id === updatedSale.sale_id ? updatedSale : sale))
        );
    };

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

            <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormControl fullWidth>
                    <InputLabel id="session-select-label">Session</InputLabel>
                    <Select
                        labelId="session-select-label"
                        value={selectedSession}
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

                <FormControl fullWidth>
                    <InputLabel id="seller-select-label">Vendeur</InputLabel>
                    <Select
                        labelId="seller-select-label"
                        value={selectedSeller}
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
                            seller = {sellers.find(seller =>
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

            <AddSaleModal open={openAdd} onClose={() => setOpenAdd(false)} onAdd={handleAddSale} />
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