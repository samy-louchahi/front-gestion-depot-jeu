import { api } from './api';
import { Gestionnaire } from '../types';

// Récupérer tous les gestionnaires
export const getGestionnaires = async (): Promise<Gestionnaire[]> => {
    const response = await api.get('/gestionnaires');
    return response.data;
};

// Créer un gestionnaire
export const createGestionnaire = async (data: Omit<Gestionnaire, 'id'>) => {
    const response = await api.post('/gestionnaires', data);
    return response.data;
};

// Mettre à jour un gestionnaire
export const updateGestionnaire = async (id: number, data: Partial<Gestionnaire>) => {
    const response = await api.put(`/gestionnaires/${id}`, data);
    return response.data;
};

// Supprimer un gestionnaire
export const deleteGestionnaire = async (id: number) => {
    await api.delete(`/gestionnaires/${id}`);
};