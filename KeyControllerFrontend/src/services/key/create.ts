import { api } from '../api';

interface CreateKeyDTO {
  number: string;
  sectorId: number;
}

export const createKeyService = async (data: CreateKeyDTO) => {
  await api.post('/key', data);
};
