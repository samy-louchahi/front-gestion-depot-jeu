// services/stockService.ts
import {api} from './api';
import { Stock } from '../types';

export const createOrUpdateStock = async (stockData: {
    session_id: number;
    seller_id: number;
    game_id: number;
    initial_quantity: number;
    current_quantity: number;
}) : Promise<Stock> => {
    try {
        const response = await api.post('/stocks', stockData);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la création/mise à jour du stock:', error);
        throw error;
    }
};