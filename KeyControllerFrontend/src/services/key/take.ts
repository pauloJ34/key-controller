import { api } from '@/services/api';

export const takeKeyService = async (keyId: number) => {
  await api.post(`/schedule/now/${keyId}`);
};
