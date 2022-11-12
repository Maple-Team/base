import { randomHex, rgbToHex } from '@/color'
import { isColorStr } from '@/reg'

describe('color test cases', () => {
  describe('rgbToHex tests', () => {
    it.concurrent.each([
      [255, 0, 0, '#ff0000'],
      [0, 255, 0, '#00ff00'],
      [0, 0, 255, '#0000ff'],
      [0, 0, 0, '#000000'],
      [2, 2, 2, '#020202'],
    ])('rgb(%d, %d, %d) is $s', (r, g, b, color) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(rgbToHex(r, g, b)).toEqual(color)
    })
  })
  describe('random tests', () => {
    it('随机生成的颜色符合颜色值的表示条件', () => {
      expect(isColorStr(randomHex())).toEqual(true)
    })
  })
})
