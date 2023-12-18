import { approveScheduleService } from './approve';
import { cancelScheduleService } from './cancel';
import { confirmReturnScheduleKeyService } from './confirmReturn';
import { createScheduleService } from './create';
import { getCurrentSchedule } from './getCurrent';
import { getScheduleKeyService } from './getKey';
import { listKeyHistoryService } from './history';
import { listScheduleService } from './list';
import { returnScheduleKeyService } from './return';

export const scheduleService = {
  getCurrent: getCurrentSchedule,
  getKey: getScheduleKeyService,
  list: listScheduleService,
  history: listKeyHistoryService,
  create: createScheduleService,
  approve: approveScheduleService,
  return: returnScheduleKeyService,
  cancel: cancelScheduleService,
  confirmReturn: confirmReturnScheduleKeyService,
};
