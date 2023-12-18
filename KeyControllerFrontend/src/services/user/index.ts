import { getUserDataService } from './data';
import { userLoginService } from './login';

export const userService = {
  login: userLoginService,
  getData: getUserDataService,
};
