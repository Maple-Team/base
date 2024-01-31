export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  DEVICE = 'device',
  GUEST = 'guest',
}

export type RoleTypes = keyof typeof UserRole
