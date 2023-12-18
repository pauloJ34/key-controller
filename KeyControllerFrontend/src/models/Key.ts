export interface KeyModel {
  id: number;
  number: string;

  sectorId: number;
  sectorName: string;
  busy: boolean;

  createdAt: Date;
  updatedAt: Date;
}
