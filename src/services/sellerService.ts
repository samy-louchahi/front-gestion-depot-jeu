// src/services/sellerService.ts

import {api} from './api';
import { Seller, Stock, SaleDetail, Balance, Session } from '../types';
import pLimit from 'p-limit';

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
    console.log(`stock pour ${seller_id}`,response.data);
    return response.data;
};

/**
 * Récupère les détails des ventes d'un vendeur
 */
export const getSellerSaleDetails = async (seller_id: number): Promise<SaleDetail[]> => {
    const response = await api.get(`/saleDetails`, {
        params: { seller_id }
    });
    return response.data;
};

/**
 * Récupère les sessions via les dépôts pour un vendeur
 */
export const getSellerSessionsViaDeposits = async (seller_id: number): Promise<Session[]> => {
    const response = await api.get(`/sessions`, {
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

/**
 * Récupère les bilans financiers de toutes les sessions d'un vendeur (via ventes et dépôts)
 */
export const getAllSellerBalances = async (seller_id: number): Promise<Balance[]> => {
    // Récupérer les détails des ventes du vendeur
    const saleDetails: SaleDetail[] = await getSellerSaleDetails(seller_id);

    // Extraire les session_ids uniques des ventes
    const sessionIdSet = new Set<number>();
    saleDetails.forEach(detail => {
        if (detail.Sale && detail.Sale.session_id) {
            sessionIdSet.add(detail.Sale.session_id);
        }
    });
    const salesSessionIds = Array.from(sessionIdSet);

    // Récupérer les sessions via les dépôts
    const depositSessions = await getSellerSessionsViaDeposits(seller_id);

    // Extraire les session_ids via dépôts qui ne sont pas déjà dans les ventes
    const depositSessionIds = depositSessions
        .map(session => session.session_id)
        .filter((session_id): session_id is number => session_id !== undefined && !sessionIdSet.has(session_id));

    // Limiter les requêtes simultanées à 5 pour éviter de surcharger le serveur
    const limit = pLimit(5);

    // Récupérer les bilans via dépôts
    const depositBalancePromises = depositSessionIds.map(session_id =>
        limit(() => getSellerBalance(session_id, seller_id))
    );

    const depositBalances = await Promise.all(depositBalancePromises);

    // Récupérer les bilans via ventes
    const salesBalancePromises = salesSessionIds.map(session_id =>
        limit(() => getSellerBalance(session_id, seller_id))
    );

    const salesBalances = await Promise.all(salesBalancePromises);

    // Combiner les bilans
    const allBalances = [...salesBalances, ...depositBalances];

    return allBalances;
};