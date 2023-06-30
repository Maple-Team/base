import { Accessory } from './accessory'

export enum OperationType {
  STOCK_IN = 'Stock In',
  STOCK_OUT = 'Stock Out',
}

export interface Operation {
  id: number
  operationText: string
  accessoryNum: number
  operationType: OperationType
  createdAt: string
  updatedAt: string
  accessory?: Accessory
}
export interface AccessoryStats {
  accessoryId: string
  count: number
  accessoryName: string
}
export interface UserStats {
  userId: string
  count: number
  userName: string
}
