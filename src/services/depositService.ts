// src/services/depositService.ts

import api from './api';
import { Deposit, DepositGame, Game, Session, Seller } from '../types';

// Configurer une instance axios avec une baseURL

// **Deposit Services**

/**
 * Créer un nouveau dépôt avec ses jeux associés
 */
export const createDeposit = async (depositData: {
    seller_id: number;
    session_id: number;
    discount_fees?: number;
    deposit_date: string;
    games: {
        game_id: number;
        price: number;
        quantity: number;
    }[];
}): Promise<Deposit> => {
    const response = await api.post('/deposits', depositData);
    return response.data;
};

/**
 * Récupérer tous les dépôts avec leurs jeux associés
 */
export const getAllDeposits = async (): Promise<Deposit[]> => {
    const response = await api.get('/deposits');
    return response.data;
};

/**
 * Récupérer un dépôt par ID
 */
export const getDepositById = async (id: number): Promise<Deposit> => {
    const response = await api.get(`/deposits/${id}`);
    return response.data;
};

/**
 * Mettre à jour un dépôt
 */
export const updateDeposit = async (id: number, depositData: Partial<Deposit>): Promise<Deposit> => {
    const response = await api.put(`/deposits/${id}`, depositData);
    return response.data;
};

/**
 * Supprimer un dépôt
 */
export const deleteDeposit = async (id: number): Promise<void> => {
    await api.delete(`/deposits/${id}`);
};

// **DepositGame Services**

/**
 * Créer un jeu déposé
 */
export const createDepositGame = async (depositGameData: Omit<DepositGame, 'deposit_game_id' | 'label'>): Promise<DepositGame> => {
    const response = await api.post('/deposit-games', depositGameData);
    return response.data;
};

/**
 * Récupérer tous les jeux déposés avec leurs dépôts et jeux associés
 */
export const getAllDepositGames = async (): Promise<DepositGame[]> => {
    const response = await api.get('/depositGames');
    return response.data;
};

/**
 * Récupérer un jeu déposé par ID
 */
export const getDepositGameById = async (id: number): Promise<DepositGame> => {
    const response = await api.get(`/depositGames/${id}`);
    return response.data;
};

/**
 * Mettre à jour un jeu déposé
 */
export const updateDepositGame = async (id: number, depositGameData: Partial<DepositGame>): Promise<DepositGame> => {
    const response = await api.put(`/depositGames/${id}`, depositGameData);
    return response.data;
};

/**
 * Supprimer un jeu déposé
 */
export const deleteDepositGame = async (id: number): Promise<void> => {
    await api.delete(`/depositGames/${id}`);
};

// **Additional Services**

/**
 * Récupérer toutes les sessions actives
 */
export const getActiveSessions = async (): Promise<Session[]> => {
    const response = await api.get('/sessions', { params: { status: true } });
    return response.data;
};

/**
 * Récupérer tous les vendeurs
 */
export const getSellers = async (): Promise<Seller[]> => {
    const response = await api.get('/sellers');
    return response.data;
};

/**
 * Récupérer tous les jeux
 */
export const getGames = async (): Promise<Game[]> => {
    const response = await api.get('/games'); // Assurez-vous que cet endpoint existe
    return response.data;
};