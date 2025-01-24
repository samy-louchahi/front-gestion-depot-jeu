// src/components/sales/SaleList.tsx

import React, { useEffect, useState } from 'react';
import {
    Button,
    Typography,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddSaleModal from './AddSaleModal';
import UpdateSaleModal from './UpdateSaleModal';
import { Sale, Session } from '../../types';
import { getAllSales, deleteSale } from '../../services/saleService';

const SaleList: React.FC = () => {
    const [sales, setSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [openAdd, setOpenAdd] = useState<boolean>(false);
    const [openUpdate, setOpenUpdate] = useState<boolean>(false);
    const [currentSale, setCurrentSale] = useState<Sale | null>(null);

    const fetchSales = async () => {
        try {
            const data = await getAllSales();
            setSales(data);
            setError(null);
        } catch (err: any) {
            console.error('Error fetching sales:', err);
            setError('Échec de la récupération des ventes.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSales();
    }, []);

    const handleAddSale = (newSale: Sale) => {
        setSales((prev) => [...prev, newSale]);
    };

    const handleUpdateSale = (updatedSale: Sale) => {
        setSales((prev) =>
            prev.map((sale) => (sale.sale_id === updatedSale.sale_id ? updatedSale : sale))
        );
    };

    const handleDeleteSale = async (id: number) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette vente ?')) {
            try {
                await deleteSale(id);
                setSales((prev) => prev.filter((sale) => sale.sale_id !== id));
                setError(null);
            } catch (err) {
                console.error('Error deleting sale:', err);
                setError('Échec de la suppression de la vente.');
            }
        }
    };

    const handleOpenUpdate = (sale: Sale) => {
        setCurrentSale(sale);
        setOpenUpdate(true);
    };

    const handleCloseUpdate = () => {
        setCurrentSale(null);
        setOpenUpdate(false);
    };

    if (loading) {
        return <Typography className="text-center mt-10">Chargement...</Typography>;
    }

    return (
        <Box className="container mx-auto p-4">
            <Box className="flex justify-between items-center mb-4">
                <Typography variant="h4" className="font-bold">
                    Liste des Ventes
                </Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenAdd(true)}>
                    Ajouter une Vente
                </Button>
            </Box>
            {error && (
                <Typography className="text-center mb-4 text-red-500">
                    {error}
                </Typography>
            )}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID Vente</TableCell>
                            <TableCell>Acheteur</TableCell>
                            <TableCell>Session</TableCell>
                            <TableCell>Date de Vente</TableCell>
                            <TableCell>Statut</TableCell>
                            <TableCell>Total Vente (€)</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sales.map((sale) => {
                            const totalSale = sale.SaleDetails?.reduce((acc, detail) => {
                                return acc + detail.DepositGame!.price * detail.quantity;
                            }, 0) || 0;

                            const commission = sale.SalesOperation?.commission || 0;
                            const saleStatus = sale.sale_status || 'N/A';

                            return (
                                <TableRow key={sale.sale_id}>
                                    <TableCell>{sale.sale_id}</TableCell>
                                    <TableCell>{sale.Buyer?.name || 'N/A'}</TableCell>
                                    <TableCell>{sale.Session?.name || 'N/A'}</TableCell>
                                    <TableCell>{new Date(sale.sale_date).toLocaleDateString()}</TableCell>
                                    <TableCell>{saleStatus}</TableCell>
                                    <TableCell>{totalSale}</TableCell>
                                    <TableCell>{commission}</TableCell>
                                    <TableCell>
                                        <IconButton
                                            aria-label="edit"
                                            size="small"
                                            onClick={() => handleOpenUpdate(sale)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            aria-label="delete"
                                            size="small"
                                            onClick={() => sale.sale_id && handleDeleteSale(sale.sale_id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Add Sale Modal */}
            <AddSaleModal
                open={openAdd}
                onClose={() => setOpenAdd(false)}
                onAdd={handleAddSale}
            />

            {/* Update Sale Modal */}
            {currentSale && (
                <UpdateSaleModal
                    open={openUpdate}
                    onClose={handleCloseUpdate}
                    sale={currentSale}
                    onUpdate={handleUpdateSale}
                />
            )}
        </Box>
    );
};

export default SaleList;
