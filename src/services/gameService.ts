import {api, apiCsv} from './api';
import { Game, Stock } from '../types';
import { AxiosResponse } from 'axios';


export const getGames = async (): Promise<Game[]> => {
    const response = await api.get('/games');
    return response.data;
};

export const getGameById = async (id: number): Promise<Game> => {
    const response = await api.get(`/games/${id}`);
    return response.data;
};

// Remplacez vos fonctions createGame et updateGame par :

export const createGame = async (game: FormData): Promise<Game> => {
    const response = await apiCsv.post('/games', game);
    return response.data;
};

export const updateGame = async (id: number, game: FormData): Promise<Game> => {
    const response = await apiCsv.put(`/games/${id}`, game);
    return response.data;
};

export const deleteGame = async (id: number): Promise<void> => {
    await api.delete(`/games/${id}`);
};
export const getGameStocks = async (gameId: number): Promise<Stock[]> => {
    const response = await api.get(`/games/${gameId}/stocks`);
    return response.data;
};
export const importGames = async (formData: FormData): Promise<void> => {

    const response = await apiCsv.post('/csvImport/import', formData);

    return response.data;
};