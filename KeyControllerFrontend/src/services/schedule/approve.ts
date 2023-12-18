import { api } from '@/services/api';

export const approveScheduleService = async (id: number, approved: boolean) => {
  await api.patch(`/schedule/${id}/approve?approve=${approved}`);
};
