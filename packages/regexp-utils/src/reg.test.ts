import { chineseRegexp, pairQuoteReg } from './reg'

describe('regexp test case collections', () => {
  describe('chinese character test cases', () => {
    it('case 1', () => {
      expect(chineseRegexp.test('我是谁')).toEqual(true)
      expect(chineseRegexp.test('我是谁1')).toEqual(true)
    })
  })
  describe('pairQuoteReg case', () => {
    it.concurrent.each([
      [`"a"`, true],
      [`'a'`, true],
      [`"a'`, false],
      [`'a"`, false],
    ])('%s is %o pair quotes', (a, b) => {
      expect(pairQuoteReg.test(a)).toBe(b)
    })
  })
})
