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
