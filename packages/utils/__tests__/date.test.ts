import { getWeekNumber } from '@/date'
import { test } from '@/array'

describe('date utils', () => {
  describe('get week number tests', () => {
    it('case 1', () => {
      // TODO concurrent
      expect(getWeekNumber(new Date())).toEqual(37)
      expect(test()).toEqual(37)
    })
  })
})
