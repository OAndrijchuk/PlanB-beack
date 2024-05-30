import { User } from 'src/user/entities/user.entity';

export interface IUser {
  id: string;
  email: string;
  userName: string;
  isVerify: boolean;
}
export interface IToken {
  id: number;
  refreshToken: string;
  accessToken: string;
  createdAt: Date;
  updatedAt: Date;
  userId: User;
}
// =========================================
export interface IResponsUser {
  id: string;
  email: string;
  userName: string;
  isVerify: boolean;
}
export interface IResponsToken {
  accessToken: string;
}

export enum StatusType {
  Pending = 'pending',
  Fulfilled = 'fulfilled',
  Rejected = 'rejected',
}

export enum RoleType {
  Member = 'member',
  Owner = 'owner',
  Admin = 'admin',
}
