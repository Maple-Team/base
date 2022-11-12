/*
 * @Description: 数组操作相关
 * @Author: Liutsing
 */

/**
 * shuffle a array
 * @param arr
 * @returns
 */
export const shuffleArray = <T>(arr: T[]) => arr.sort(() => 0.5 - Math.random())

/**
 *
 * @param num
 * @returns
 */
export function generateArray(num: number): Array<number> {
  // TODO 支持cb
  return Array.from({ length: num }, (_, i) => i)
}

/**
 * 移除数组中的某个元素
 * @param array
 * @param item
 * @param cb
 * @returns
 */
export function removeItem<T>(array: T[], item: T, cb?: (arr: T[], item: T) => number) {
  if (cb) {
    array.splice(cb(array, item) >>> 0, 1)
  } else {
    array.splice(array.indexOf(item) >>> 0, 1)
  }
  return array
}
