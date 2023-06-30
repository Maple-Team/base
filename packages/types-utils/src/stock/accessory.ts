export interface Accessory {
  id: number
  /**
   * 货架号
   */
  stockNo: string
  /**
   * 货架层数
   */
  stockLayer: string
  /**
   * 货架格数
   */
  stockCell: number
  /**
   * 货架地址
   */
  stockAddress: number
  /**
   * 名称
   */
  accessoryName: string
  /**
   * 数量
   */
  accessoryNum: number
  /**
   * 单位
   */
  accessoryUnit: string
  /**
   * 物料编号
   */
  accessoryId: string
  /**
   * 厂家
   */
  accessoryFactory: string
  /**
   * 备注
   */
  remark: string
  /**
   * 其他信息
   */
  extraInfo: string
  createdAt: string
  updatedAt: string
}
