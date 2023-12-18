import { KeyInUseModel } from '@/models';
import { api } from '@/services/api';

export const getKeyInUseService = async () => {
  const response = await api.get<KeyInUseModel | null>('/schedule/key/in-use');
  return response.data;
};
