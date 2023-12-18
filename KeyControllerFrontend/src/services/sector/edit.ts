import { api } from '../api';

interface EditSectorDTO {
  id: number;
  name: string;
}

export const editSectorService = async (data: EditSectorDTO) => {
  await api.put('/sector', data);
};
