export type UserType = 'STUDENT' | 'SERVER' | 'ADMIN';

export interface UserModel {
  registry: string;
  name: string;
  type: UserType;

  createdAt: Date;
  updatedAt: Date;
}
