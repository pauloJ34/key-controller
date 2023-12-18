import { api } from '../api';

export const deleteKeyService = async (id: number) => {
  await api.patch(`/key/${id}/delete`);
};
