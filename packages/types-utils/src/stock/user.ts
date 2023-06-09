export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
}

export interface UserInfo {
  role: UserRole
  username: string
  avatar: string
  phone: string
  id: number
  staffId: string
  createdAt: string
  updatedAt: string
  password?: string
}

export type UserAccount = Pick<UserInfo, 'phone'> & {
  password: string
}

export interface ChangePwdDto {
  oldPasswd: string
  newPasswd: string
}
