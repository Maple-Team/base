import { getWeekNumber } from '@/date'

/**
 * shuffle a array
 * @param arr
 * @returns
 */
export const shuffleArray = <T>(arr: T[]) => arr.sort(() => 0.5 - Math.random())

export const test = () => {
  return getWeekNumber()
}
