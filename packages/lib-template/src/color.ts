/**
 * Convert RGB to Hex
 * @param r
 * @param g
 * @param b
 * @returns
 */
export const rgbToHex = (r, g, b) => '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toLowerCase()

/**
 * Generate Random Hex
 * @returns
 */
export const randomHex = () =>
  `#${Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padEnd(6, '0')}`
