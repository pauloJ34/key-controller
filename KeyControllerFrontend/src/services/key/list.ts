import { Paginated } from '@/types';
import { api } from '../api';
import { KeyModel } from '@/models';

interface ListKeysDTO {
  currentPage: number;
  pageSize: number;
  search?: string;
  sectorId?: number;
  busy?: string;
}

type ListKeysResultDTO = Paginated<
  KeyModel & {
    sectorId: number;
    sectorName: string;
    busy: boolean;
  }
>;

export const listKeysService = async (params: ListKeysDTO) => {
  const response = await api.get<ListKeysResultDTO>('/key', { params });
  return response.data;
};
