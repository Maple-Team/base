import type { ColorNumber } from '@liutsing/types-utils'
import { padEnd } from './help'

/**
 * Convert RGB to Hex
 * @param r
 * @param g
 * @param b
 * @returns
 */
export const rgbToHex = (r: ColorNumber, g: ColorNumber, b: ColorNumber) => {
  const num1 = 1 << 24
  const _r = r << 16
  const _g = g << 8
  const num = num1 + _r + _g + b
  return `#${num.toString(16).slice(1).toLowerCase()}`
}

/**
 * Generate Random Hex
 * @returns
 */
export const randomHex = () => `#${padEnd(Math.floor(Math.random() * 0xffffff).toString(16), 6, '0')}`
