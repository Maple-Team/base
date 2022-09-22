import { dayOfYear, getWeekNumber, progressOfDay, progressOfMonth, progressOfQuarter, progressOfYear } from '@/date'

describe('date utils', () => {
  describe('week number tests', () => {
    it.concurrent.each([
      ['2022-01-01', 1],
      ['2022-01-02', 1],
      ['2022-09-16', 37],
      ['2022-09-17', 37],
      ['2022-09-18', 38],
    ])('%s is the week %d', (a, b) => {
      expect(getWeekNumber(new Date(a))).toEqual(b)
    })
  })
  describe('dayOfYear tests', () => {
    it.concurrent.each([
      ['2022-01-01', 1],
      ['2022-09-16', 259],
    ])('%s is the %d day of year', (a, b) => {
      expect(dayOfYear(new Date(a))).toEqual(b)
    })
  })
  describe('progress of day', () => {
    console.log(progressOfDay())
    console.log(progressOfMonth())
    console.log(progressOfQuarter())
    console.log(progressOfYear())
  })
})
