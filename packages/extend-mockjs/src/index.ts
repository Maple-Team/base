import { Random, mock } from 'mockjs'
import * as moment from 'moment'
import { constellations } from './utils'
import SnowflakeId from 'snowflake-id'

declare module 'mockjs' {
  interface MockjsRandom {
    constellation(): string
    /**
     * jwt
     */
    jwt(): string
    /**
     * 设备序列号
     */
    sn(): string
    /**
     * 车辆vin码
     */
    vin(): string
    /**
     * 雪花id
     */
    snowId(): string
    /**
     * 纬度
     */
    lat(): number
    /**
     * 经度
     */
    lng(): number
  }
}

Random.extend({
  constellation: function () {
    return this.pick(constellations)
  },
  /**
   * 时间戳
   * @param millesimal 是否带毫秒
   * @returns
   */
  unix: function (millesimal: boolean) {
    const date = mock({
      date: '@date',
    }).date
    if (millesimal) {
      return moment(date).valueOf()
    } else {
      return moment(date).valueOf() / 1000
    }
  },
  coordinates: () => {
    return [Math.random() * 180, Math.random() * 90]
  },
  /**
   * 经度
   * @returns
   */
  lng: function () {
    return this.float(-180, 180)
  },
  /**
   * 纬度
   * @returns
   */
  lat: function () {
    return this.float(-90, 90)
  },
  httpCode: function () {
    const codes = [200, 201, 206, 400, 401, 403, 404, 405, 500, 501, 502]
    return this.pick(codes)
  },

  /**
   * 版本号
   * @https://semver.org/
   * @param major 大版本号取值范围
   * @param minor 小版本号取值范围
   * @param patch 补丁版本号取值范围
   * @returns
   */
  semVer: function (major: number, minor: number, patch: number) {
    // eslint-disable-next-line prettier/prettier
    return `${this.natural(0, major || 10)}.${this.natural(0, minor || 100)}.${this.natural(0, patch || 100)}`
  },
  d1: function () {
    return this.natural(0, 1)
  },
  d2: function () {
    return this.natural(0, 2)
  },
  /**
   * 桩序列号
   * @param length 长度
   * @returns
   */
  sn: function (length = 18) {
    const pools = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

    return Array.from({ length }, (_, i) => i)
      .map(() => pools[this.natural(0, pools.length - 1)])
      .join('')
  },
  /**
   * 一组状态值
   * @param max 最大数据
   * @param isFromZero 是否从0开始
   * @param num 状态个数
   * @returns
   */
  gunStatus: function (max: number, isFromZero = false, num?: number) {
    const _num = num || this.natural(1, 4)
    return Array.from({ length: _num }, (_, i) => i).map(() =>
      this.natural(isFromZero ? 0 : 1, isFromZero ? max - 1 : max)
    )
  },
  /**
   * 返回jwt的token
   */
  jwt() {
    // eslint-disable-next-line prettier/prettier
    return `${this.string(20, 40)}.${this.string(20, 40)}.${this.string(20, 40)}`
  },
  /**
   * 车辆vin码
   * @returns
   */
  vin() {
    return this.sn(17)
  },
  /**
   * 雪花id
   * @returns
   */
  snowId() {
    const snowflake = new SnowflakeId({
      mid: 42,
      offset: (2022 - 1970) * 31536000 * 1000,
    })
    return snowflake.generate()
  },
})
