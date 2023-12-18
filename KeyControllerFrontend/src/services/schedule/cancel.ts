import { api } from '@/services/api';

export const cancelScheduleService = async (id: number) => {
  await api.patch(`/schedule/${id}/cancel`);
};
