import {api} from './api';
import { Buyer } from '../types';

export const getBuyers = async (): Promise<Buyer[]> => {
    const response = await api.get('/buyers');
    return response.data;
};

export const getBuyerById = async (id: number): Promise<Buyer> => {
    const response = await api.get(`/buyers/${id}`);
    return response.data;
};

export const createBuyer = async (buyer: Omit<Buyer, 'buyer_id'>): Promise<Buyer> => {
    const response = await api.post('/buyers', buyer);
    return response.data;
};

export const updateBuyer = async (id: number, buyer: Partial<Buyer>): Promise<Buyer> => {
    const response = await api.put(`/buyers/${id}`, buyer);
    return response.data;
};

export const deleteBuyer = async (id: number): Promise<void> => {
    await api.delete(`/buyers/${id}`);
};