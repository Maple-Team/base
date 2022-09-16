import { getWeekNumber } from '../src/date'
// TODO path alias

describe('date utils', () => {
  describe('get week number tests', () => {
    it('case 1', () => {
      // TODO concurrent
      expect(getWeekNumber(new Date())).toEqual(37)
    })
  })
})
