import { api } from '../api';

export const deleteSectorService = async (id: number) => {
  await api.patch(`/sector/${id}/delete`);
};
