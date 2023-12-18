import { sessionToken } from '@/helpers/authTokens';
import axios from 'axios';

export const getAPI = () => {
  const accessToken = localStorage.getItem(sessionToken);

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  });

  if (accessToken) {
    api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  }

  return api;
};
