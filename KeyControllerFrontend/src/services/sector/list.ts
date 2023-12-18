import { Paginated } from '@/types';
import { api } from '../api';
import { SectorModel } from '@/models';

interface ListSectorsDTO {
  currentPage: number;
  pageSize: number;
  search?: string;
}

type ListKeysResultDTO = Paginated<SectorModel>;

export const listKeysService = async (params: ListSectorsDTO) => {
  const response = await api.get<ListKeysResultDTO>('/sector', { params });
  return response.data;
};
