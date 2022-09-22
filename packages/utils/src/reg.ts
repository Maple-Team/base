import { chineseRegexp, colorReg } from '@liutsing/regexp-utils'

/**
 * Match Chinese Characters
 * https://stackoverflow.com/a/21113538
 * @param str
 * @returns
 */
export const isChinese1 = (str: string) => chineseRegexp.test(str)

/**
 * Match Chinese Characters
 * Unicode_Property_Escapes
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Unicode_Property_Escapes
 * @param str
 * @returns
 */
export const isChinese = (str: string) => /\p{Script=Han}/u.test(str)

/**
 * 是否为颜色值表示字符串
 * 如#ff9527
 */
export const isColorStr = (str: string) => colorReg.test(str)
