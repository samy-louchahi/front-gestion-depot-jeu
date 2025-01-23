import api from './api';
import { Game } from '../types';

export const getGames = async (): Promise<Game[]> => {
    const response = await api.get('/games');
    return response.data;
};

export const getGameById = async (id: number): Promise<Game> => {
    const response = await api.get(`/games/${id}`);
    return response.data;
};

export const createGame = async (game: Omit<Game, 'game_id'>): Promise<Game> => {
    const response = await api.post('/games', game);
    return response.data;
};

export const updateGame = async (id: number, game: Partial<Game>): Promise<Game> => {
    const response = await api.put(`/games/${id}`, game);
    return response.data;
};

export const deleteGame = async (id: number): Promise<void> => {
    await api.delete(`/games/${id}`);
};