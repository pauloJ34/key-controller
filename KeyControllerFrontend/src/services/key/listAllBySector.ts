import { KeyModel } from '@/models';
import { api } from '../api';

export const listAllKeysBySectorService = async (sectorId: string) => {
  const response = await api.get<KeyModel[]>(`/key/sector/${sectorId}`);
  return response.data;
};
