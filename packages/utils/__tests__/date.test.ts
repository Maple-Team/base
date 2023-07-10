import {
  dayOfYear,
  getWeekNumber,
  // progressOfDay,
  // progressOfMonth,
  // progressOfQuarter,
  // progressOfYear,
  showHumanizeTime,
} from '@/date'

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
    // console.log(progressOfDay())
    // console.log(progressOfMonth())
    // console.log(progressOfQuarter())
    // console.log(progressOfYear())
  })
  describe('seconds4human', () => {
    it.concurrent.each([
      [1, '00:00:01'],
      [60, '00:01:00'],
      [61, '00:01:01'],
      [121, '00:02:01'],
      [465, '00:07:45'],
      [60 * 60 * 2 + 5, '02:00:05'],
    ])('showHumanizeTime(%d) should be %s', (value, formats) => {
      expect(showHumanizeTime(value)).toBe(formats)
    })
    it.concurrent.each([
      [1, true, '00:01'],
      [60, true, '01:00'],
      [61, true, '01:01'],
      [121, true, '02:01'],
      [60 * 60 * 2 + 5, false, '02:00:05'],
    ])('showHumanizeTime(%d, %o) should be %s', (value, trim, formats) => {
      expect(showHumanizeTime(value, trim)).toBe(formats)
    })
  })
})
