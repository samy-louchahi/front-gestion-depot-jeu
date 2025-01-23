import api from './api';
import { Deposit } from '../types';

export const getDeposits = async (): Promise<Deposit[]> => {
    const response = await api.get('/deposits');
    return response.data;
};

export const getDepositById = async (id: number): Promise<Deposit> => {
    const response = await api.get(`/deposits/${id}`);
    return response.data;
};

export const createDeposit = async (deposit: Omit<Deposit, 'deposit_id'>): Promise<Deposit> => {
    const response = await api.post('/deposits', deposit);
    return response.data;
};

export const updateDeposit = async (id: number, deposit: Partial<Deposit>): Promise<Deposit> => {
    const response = await api.put(`/deposits/${id}`, deposit);
    return response.data;
};

export const deleteDeposit = async (id: number): Promise<void> => {
    await api.delete(`/deposits/${id}`);
};