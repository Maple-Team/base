import { chineseRegexp } from '@liutsing/regexp-utils'
/**
 * Match Chinese Characters
 * https://stackoverflow.com/a/21113538
 * @param str
 * @returns
 */
export function isChinese1(str: string): boolean {
  return chineseRegexp.test(str)
}
/**
 * Match Chinese Characters
 * Unicode_Property_Escapes
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Unicode_Property_Escapes
 * @param str
 * @returns
 */
export function isChinese(str: string): boolean {
  return /\p{Script=Han}/u.test(str)
}
