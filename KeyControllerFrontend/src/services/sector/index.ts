import { createSectorService } from './create';
import { deleteSectorService } from './delete';
import { editSectorService } from './edit';
import { listKeysService } from './list';

export const sectorService = {
  list: listKeysService,
  create: createSectorService,
  edit: editSectorService,
  delete: deleteSectorService,
};
