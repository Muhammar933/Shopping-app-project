import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically inject JWT Bearer Token from SecureStore
apiClient.interceptors.request.use(async (config) => {
  try {
    const token = await SecureStore.getItemAsync('threadly_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // Non-blocking in environments without SecureStore
  }
  return config;
});

// Response interceptor for unified error unwrapping
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.error?.message ||
      error.message ||
      'An unexpected network error occurred';
    return Promise.reject(new Error(message));
  }
);
