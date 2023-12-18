import { SectorModel, UserModel } from '.';

export interface ScheduleModel {
  id: number;
  key: {
    id: number;
    number: string;
    sector: SectorModel;
    createAt: Date;
    updatedAt: Date;
  };
  user: UserModel;
  caught: boolean;
  acquisitionDate: string;
  devolutionDate: string;
}
