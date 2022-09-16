/**
 * 判断日期是否有效
 * @param val
 * @returns
 */
export const isDateValid = (val: string | number) => !Number.isNaN(new Date(val).valueOf())
/**
 * 获取日期对应的天数
 * @param date
 * @returns
 */
export const dayOfYear = (date: Date) =>
  Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24)

/**
 * 获取当前的周数
 * @returns
 */
export const getWeekNumber = (date = new Date()) => {
  const startDate = new Date(date.getFullYear(), 0, 1)
  const days = Math.floor((date.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000))

  return Math.ceil(days / 7)
}
