import { createKeyService } from './create';
import { deleteKeyService } from './delete';
import { editKeyService } from './edit';
import { listKeysService } from './list';
import { listAllKeysBySectorService } from './listAllBySector';
import { getKeyInUseService } from './inUse';
import { takeKeyService } from './take';

export const keyService = {
  list: listKeysService,
  listBySector: listAllKeysBySectorService,
  create: createKeyService,
  edit: editKeyService,
  delete: deleteKeyService,
  take: takeKeyService,
  inUse: getKeyInUseService,
};
