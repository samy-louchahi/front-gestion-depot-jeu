// src/services/sessionService.ts

import api from './api';
import { Session, Balance } from '../types';

export const getSessions = async (): Promise<Session[]> => {
    const response = await api.get('/sessions');
    return response.data;
};

export const getSessionById = async (id: number): Promise<Session> => {
    const response = await api.get(`/sessions/${id}`);
    return response.data;
};

export const createSession = async (session: Omit<Session, 'session_id' | 'status'>): Promise<Session> => {
    const response = await api.post('/sessions', session);
    return response.data;
};

export const updateSession = async (id: number, session: Partial<Session>): Promise<Session> => {
    const response = await api.put(`/sessions/${id}`, session);
    return response.data;
};

export const deleteSession = async (id: number): Promise<void> => {
    await api.delete(`/sessions/${id}`);
};

export const getGlobalBalanceBySession = async (session_id: number): Promise<Balance> => {
    const response = await api.get(`/finances/session/${session_id}`);
    return response.data;
};