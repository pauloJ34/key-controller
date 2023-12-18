export interface KeyRegisterModel {
  id: number;
  key: {
    id: number;
    number: string;
    sector: {
      id: number;
      name: string;
    };
  };
  user: {
    registry: string;
    name: string;
  };
  returned: boolean;
  acquisitionDate: Date;
  devolutionDate: Date | null;
}

export interface KeyInUseModel {
  id: number;
  returned: boolean;
  acquisitionDate: Date;
  devolutionDate: Date | null;
  keyNumber: string;
  sectorName: string;
}
