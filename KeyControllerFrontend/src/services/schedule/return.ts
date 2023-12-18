import { api } from '@/services/api';

export const returnScheduleKeyService = async (id: number) => {
  await api.patch(`/schedule/${id}/return`);
};
