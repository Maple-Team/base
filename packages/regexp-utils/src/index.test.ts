import { chineseRegexp } from './index'

describe('regexp test case collections', () => {
  describe('chinese character test cases', () => {
    it('case 1', () => {
      expect(chineseRegexp.test('我是谁')).toEqual(true)
      expect(chineseRegexp.test('我是谁1')).toEqual(true)
    })
  })
})
