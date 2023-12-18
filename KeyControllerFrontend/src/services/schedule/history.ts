import { ScheduleModel } from '@/models';
import { api } from '@/services/api';
import { Paginated } from '@/types';

interface ListKeyHistoryDTO {
  currentPage: number;
  pageSize: number;
  notReturned?: boolean;
  notConfirmed?: boolean;
}

type ListKeyHistoryResultDTO = Paginated<ScheduleModel>;

export const listKeyHistoryService = async (params: ListKeyHistoryDTO) => {
  const response = await api.get<ListKeyHistoryResultDTO>('/schedule/history', {
    params,
  });
  return response.data;
};
