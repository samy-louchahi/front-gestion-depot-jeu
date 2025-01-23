// src/services/sellersService.ts

import api from './api';
import { Seller, Stock, Sale, Balance } from '../types';

/**
 * Récupère tous les vendeurs
 */
export const getSellers = async (): Promise<Seller[]> => {
    const response = await api.get('/sellers');
    return response.data;
};

/**
 * Récupère un vendeur par ID
 */
export const getSellerById = async (id: number): Promise<Seller> => {
    const response = await api.get(`/sellers/${id}`);
    return response.data;
};

/**
 * Crée un nouveau vendeur
 */
export const createSeller = async (seller: Omit<Seller, 'seller_id'>): Promise<Seller> => {
    const response = await api.post('/sellers', seller);
    return response.data;
};

/**
 * Met à jour un vendeur existant
 */
export const updateSeller = async (id: number, seller: Partial<Seller>): Promise<Seller> => {
    const response = await api.put(`/sellers/${id}`, seller);
    return response.data;
};

/**
 * Supprime un vendeur
 */
export const deleteSeller = async (id: number): Promise<void> => {
    await api.delete(`/sellers/${id}`);
};

/**
 * Récupère les stocks (jeux) d'un vendeur
 */
export const getSellerStocks = async (seller_id: number): Promise<Stock[]> => {
    const response = await api.get(`/stocks`, {
        params: { seller_id }
    });
    return response.data;
};

/**
 * Récupère les ventes d'un vendeur
 */
export const getSellerSales = async (seller_id: number): Promise<Sale[]> => {
    // Supposons que l'API permet de filtrer les ventes par seller_id via les SaleDetails
    const response = await api.get(`/saleDetails`, {
        params: { seller_id }
    });
    return response.data;
};

/**
 * Récupère le solde financier d'un vendeur pour une session donnée
 */
export const getSellerBalance = async (session_id: number, seller_id: number): Promise<Balance> => {
    const response = await api.get(`/finances/session/${session_id}/seller/${seller_id}`);
    return response.data;
};