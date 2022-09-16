import { macAddresReg } from './index'

describe('regexp test case collections', () => {
  describe('mac address test cases', () => {
    it('case 1', () => {
      expect(macAddresReg.test('aa:bb:cc:dd:ee:ff')).toEqual(true)
    })
  })
})
