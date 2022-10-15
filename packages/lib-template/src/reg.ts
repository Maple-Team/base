/**
 * 是否为颜色值表示字符串
 * 如#ff9527
 */
export const isColorStr = (str: string) => /^#/.test(str)
