import { api } from '../api';

export const createSectorService = async (name: string) => {
  await api.post('/sector', { name });
};
