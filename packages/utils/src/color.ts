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

export function generateFadedColors(baseColor: string, numColors: number): string[] {
  const { r, g, b } = hexToRgb(baseColor)
  const hsl = rgbToHsl(r, g, b)

  const step = 1 / numColors
  const colors: string[] = []

  for (let i = 0; i < numColors; i++) {
    const newSaturation = Math.max(0, hsl.s - i * step)
    const newColor = hslToHex({ h: hsl.h, s: newSaturation, l: hsl.l })
    colors.push(newColor)
  }

  return colors
}

// 辅助函数：将十六进制颜色转换为RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const bigint = parseInt(hex.slice(1), 16)
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  }
}

// 辅助函数：将RGB颜色转换为HSL
function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }

    h /= 6
  }

  return { h, s, l }
}

// 辅助函数：将HSL颜色转换为十六进制
function hslToHex(hsl: { h: number; s: number; l: number }): string {
  const { h, s, l } = hsl
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h * 6) % 2) - 1))
  const m = l - c / 2

  let r = 0
  let g = 0
  let b = 0

  if (h >= 0 && h < 1 / 6) [r, g, b] = [c, x, 0]
  else if (1 / 6 <= h && h < 1 / 3) [r, g, b] = [x, c, 0]
  else if (1 / 3 <= h && h < 1 / 2) [r, g, b] = [0, c, x]
  else if (1 / 2 <= h && h < 2 / 3) [r, g, b] = [0, x, c]
  else if (2 / 3 <= h && h < 5 / 6) [r, g, b] = [x, 0, c]
  else if (5 / 6 <= h && h <= 1) [r, g, b] = [c, 0, x]

  r = Math.round((r + m) * 255)
  g = Math.round((g + m) * 255)
  b = Math.round((b + m) * 255)

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}
