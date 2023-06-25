import type { ColorValue } from '@liutsing/types-utils'
import { padEnd } from './help'
/**
 * Convert RGB to Hex
 * @param r
 * @param g
 * @param b
 * @returns
 */
export const rgbToHex = (r: ColorValue, g: ColorValue, b: ColorValue) =>
  `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toLowerCase()}`

/**
 * Generate Random Hex
 * @returns
 */
export const randomHex = () => `#${padEnd(Math.floor(Math.random() * 0xffffff).toString(16), 6, '0')}`
