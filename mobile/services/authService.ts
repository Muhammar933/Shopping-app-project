import { apiClient } from './api';
import * as SecureStore from 'expo-secure-store';
import { User } from '../types';

export const authService = {
  async login(credentials: { email: string; password: string }) {
    const res: any = await apiClient.post('/auth/login', credentials);
    if (res.data?.token) {
      await SecureStore.setItemAsync('threadly_token', res.data.token);
    }
    return res.data;
  },

  async register(data: { email: string; password: string; firstName: string; lastName: string }) {
    const res: any = await apiClient.post('/auth/register', data);
    if (res.data?.token) {
      await SecureStore.setItemAsync('threadly_token', res.data.token);
    }
    return res.data;
  },

  async getMe(): Promise<User> {
    const res: any = await apiClient.get('/auth/me');
    return res.data;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      await SecureStore.deleteItemAsync('threadly_token');
    }
  },
};
