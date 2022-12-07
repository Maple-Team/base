import { padStartDouble } from './help'

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
  const days = Math.floor((date.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000)) || 1
  return Math.ceil(days / 7)
}

const passedSecondsOfCurrentDay = (now: Date) => {
  const hours = now.getHours()
  const minutes = now.getMinutes()
  const seconds = now.getSeconds()
  return hours * 60 * 60 + minutes * 60 + seconds
}
const passedSecondsOfCurrenMonth = (now: Date) => {
  const days = now.getDate()
  return days * 24 * 60 * 60 + passedSecondsOfCurrentDay(now)
}
export const progressOfDay = () => {
  const now = new Date()
  const total = 24 * 60 * 60
  return passedSecondsOfCurrentDay(now) / total
}

export const progressOfMonth = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const total = getMonthTotalTime(month, year)
  return passedSecondsOfCurrenMonth(now) / total
}

export const progressOfQuarter = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const currentSeasonMonths = () => {
    return (
      [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [9, 10, 11],
      ].find((seasons) => seasons.includes(month)) || []
    )
  }
  const seasonMonths = currentSeasonMonths()
  const total = seasonMonths.reduce((p, c) => p + getMonthTotalTime(c, year), 0)
  const passedMonth = seasonMonths.filter((m) => m < month)
  return (passedMonth.reduce((p, c) => p + getMonthTotalTime(c, year), 0) + passedSecondsOfCurrenMonth(now)) / total
}

export const progressOfYear = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const passed =
    Array.from({ length: 12 }, (_, i) => i)
      .filter((m) => m < month)
      .reduce((p, c) => p + getMonthTotalTime(c, year), 0) + passedSecondsOfCurrenMonth(now)
  const total = (isLeap(year) ? 366 : 365) * 24 * 60 * 60
  return passed / total
}
/**
 * 月份的秒数
 * @param month
 * @param year
 * @returns
 */
const getMonthTotalTime = (month: number, year: number) => {
  let days = 0
  switch (month) {
    case 0:
    case 2:
    case 4:
    case 6:
    case 7:
    case 9:
    case 11:
      days = 31
      break
    case 3:
    case 5:
    case 8:
    case 10:
      days = 30
      break
    case 1:
      days = isLeap(year) ? 29 : 28
      break
    default:
      break
  }
  return days * 24 * 60 * 60
}

/**
 * 是否闰年
 * @param year
 * @returns
 */
export const isLeap = (year: number) => (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0

/**
 * 时间格式化(简单处理)
 *
 * TODO use date-fns
 * @param date
 * @param _formate
 * @returns
 */
export const dateSimpleFormate = (inputDate?: Date, _formate?: 'YYYY-MM-DD HH:mm:ss') => {
  const date = inputDate || new Date()
  // TODO 解析
  return `${date.getFullYear()}-${padStartDouble(date.getMonth() + 1)}-${padStartDouble(
    date.getDate()
  )} ${date.getHours()}:${date.getMinutes()}:${padStartDouble(date.getSeconds())}`
}

export const dateFormat = dateSimpleFormate
