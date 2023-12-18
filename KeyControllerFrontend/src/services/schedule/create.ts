import { api } from '../api';

interface CreateScheduleDTO {
  keyId: number;
  acquisitionDate: Date;
  devolutionDate: Date;
}

export const createScheduleService = async (data: CreateScheduleDTO) => {
  await api.post('/schedule', data);
};
