import { api } from '@/services/api';

export const confirmReturnScheduleKeyService = async (id: number, returned: boolean) => {
  await api.patch(`/schedule/${id}/confirm-return?returned=${returned}`);
};
