import type { ColorNumber } from '@liutsing/types-utils'
import { generateFadedColors, randomHex, rgbToHex } from '../src/color'
import { isColorStr } from '../src/reg'

describe('color test cases', () => {
  describe('rgbToHex tests', () => {
    it.concurrent.each([
      [255, 0, 0, '#ff0000'],
      [0, 255, 0, '#00ff00'],
      [0, 0, 255, '#0000ff'],
      [0, 0, 0, '#000000'],
      [2, 2, 2, '#020202'],
    ])('rgb(%d, %d, %d) is $s', (r, g, b, color) => {
      expect(rgbToHex(r as ColorNumber, g as ColorNumber, b as ColorNumber)).toEqual(color)
    })
  })
  describe('random tests', () => {
    it('随机生成的颜色符合颜色值的表示条件', () => {
      expect(isColorStr(randomHex())).toEqual(true)
    })
  })
  describe('generateFadedColors tests', () => {
    it('generateFadedColors', () => {
      const fadedColors = generateFadedColors('#ff9501', 10)

      const colors = [
        '#ff9501',
        '#ff9c1a',
        '#ffa333',
        '#ffaa4d',
        '#ffb166',
        '#ffb880',
        '#ffbf99',
        '#ffc6b3',
        '#ffcdcc',
        '#ffd4e6',
        '#ffdbff',
      ]
      const received = [
        '#ff9501',
        '#f2930e',
        '#e6911a',
        '#d98f27',
        '#cc8d34',
        '#c08b41',
        '#b3884d',
        '#a6865a',
        '#998467',
        '#8d8273',
      ]

      expect(fadedColors).toEqual(received)
      expect(fadedColors).not.toEqual(colors)
    })
  })
})
