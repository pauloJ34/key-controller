import { ScheduleModel } from '@/models';
import { api } from '../api';

export const getCurrentSchedule = async () => {
  const response = await api.get<ScheduleModel | null>('schedule/current');
  return response.data;
};
