import { Credentials } from '@/types';
import { suapApi } from '.';

interface LoginResult {
  access: string;
  refresh: string;
  token: string
}

export const suapLogin = async (credentials: Credentials) => {
  // const response = await suapApi.post<LoginResult>('/autenticacao/token/', credentials);
  const response = await suapApi.post<LoginResult>('user/login', credentials);
  return response.data;
};
