import { api } from '../api';

export const getScheduleKeyService = async (scheduleId: number) => {
  await api.patch(`/schedule/${scheduleId}/confirm`);
};
