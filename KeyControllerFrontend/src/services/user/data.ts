import { UserModel } from '@/models';
import { api } from '../api';

export const getUserDataService = async () => {
  const response = await api.get<UserModel>('/user/data');
  return response.data;
};
