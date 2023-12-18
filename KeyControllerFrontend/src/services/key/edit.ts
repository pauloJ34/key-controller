import { api } from '../api';

interface EditKeyDTO {
  id: number;
  number: string;
  sectorId: number;
}

export const editKeyService = async (data: EditKeyDTO) => {
  await api.put('/key', data);
};
