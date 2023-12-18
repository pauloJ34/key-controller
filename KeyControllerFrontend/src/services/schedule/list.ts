import { ScheduleModel } from '@/models';
import { api } from '../api';
import { removeTimezone } from '@/helpers';

interface ListScheduleDTO {
  startDate: Date;
  endDate: Date;
}

export const listScheduleService = async (params: ListScheduleDTO) => {
  const { startDate, endDate } = params;

  const response = await api.get<ScheduleModel[]>('/schedule', {
    params: {
      startDate: removeTimezone(startDate),
      endDate: removeTimezone(endDate),
    },
  });

  return response.data;
};
