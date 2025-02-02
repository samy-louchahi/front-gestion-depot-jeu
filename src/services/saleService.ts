// src/services/saleService.ts

import {api} from './api';
import { Sale, SalesOperation, SaleDetail } from '../types';

// Configurer une instance Axios avec une baseURL


// **Sale Services**

/**
 * Créer une nouvelle vente
 */
export const createSale = async (saleData: {
    buyer_id?: number;
    session_id: number;
    sale_date?: string;
    sale_status?: 'en cours' | 'finalisé' | 'annulé';
}): Promise<Sale> => {
    const response = await api.post('/sales', saleData);
    return response.data;
};

/**
 * Récupérer toutes les ventes avec leurs détails
 */
export const getAllSales = async (): Promise<Sale[]> => {
    const response = await api.get('/sales');
    return response.data;
};

/**
 * Récupérer une vente par ID
 */
export const getSaleById = async (id: number): Promise<Sale> => {
    const response = await api.get(`/sales/${id}`);
    return response.data;
};

/**
 * Mettre à jour une vente
 */
export const updateSale = async (id: number, saleData: Partial<Sale>): Promise<Sale> => {
    const response = await api.put(`/sales/${id}`, saleData);
    return response.data;
};

/**
 * Supprimer une vente
 */
export const deleteSale = async (id: number): Promise<void> => {
    await api.delete(`/sales/${id}`);
};

// **SalesOperation Services**

/**
 * Créer une nouvelle opération de vente
 */
export const createSalesOperation = async (opData: {
    sale_id: number;
    commission: number;
    sale_status?: 'en cours' | 'finalisé' | 'annulé';
    sale_date?: string;
}): Promise<SalesOperation> => {
    const response = await api.post('/sale-operations', opData);
    return response.data;
};

/**
 * Récupérer toutes les opérations de vente
 */
export const getAllSalesOperations = async (): Promise<SalesOperation[]> => {
    const response = await api.get('/saleOperations');
    return response.data;
};

/**
 * Récupérer une opération de vente par ID
 */
export const getSalesOperationById = async (id: number): Promise<SalesOperation> => {
    const response = await api.get(`/saleOperations/${id}`);
    return response.data;
};

/**
 * Mettre à jour une opération de vente
 */
export const updateSalesOperation = async (id: number, opData: Partial<SalesOperation>): Promise<SalesOperation> => {
    const response = await api.put(`/saleOperations/${id}`, opData);
    return response.data;
};

/**
 * Supprimer une opération de vente
 */
export const deleteSalesOperation = async (id: number): Promise<void> => {
    await api.delete(`/saleOperations/${id}`);
};

// **SaleDetail Services**

/**
 * Créer un nouveau détail de vente
 */
export const createSaleDetail = async (detailData: {
    sale_id: number;
    deposit_game_id: number;
    quantity?: number;
}): Promise<SaleDetail> => {
    const response = await api.post('/saleDetails', detailData);
    return response.data;
};

/**
 * Récupérer tous les détails de vente
 */
export const getAllSaleDetails = async (seller_id?: number): Promise<SaleDetail[]> => {
    const params = seller_id ? { seller_id } : {};
    const response = await api.get('/saleDetails', { params });
    return response.data;
};

/**
 * Récupérer un détail de vente par ID
 */
export const getSaleDetailById = async (id: number): Promise<SaleDetail> => {
    const response = await api.get(`/saleDetails/${id}`);
    return response.data;
};

/**
 * Mettre à jour un détail de vente
 */
export const updateSaleDetail = async (id: number, detailData: Partial<SaleDetail>): Promise<SaleDetail> => {
    const response = await api.put(`/saleDetails/${id}`, detailData);
    return response.data;
};

/**
 * Supprimer un détail de vente
 */
export const deleteSaleDetail = async (id: number): Promise<void> => {
    await api.delete(`/saleDetails/${id}`);
};