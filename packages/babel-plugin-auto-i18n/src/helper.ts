import crypto from 'crypto'

/**
 * 是否为汉字
 * @param {*} text
 * @returns
 */
export function isHans(text: string) {
  return text && /\p{Script=Han}/u.test(text)
}
/**
 * 收集存在的key
 * @param {*} file
 * @param {*} value
 * @returns
 */
export function save(file: AnyToFix, key: string, value: string) {
  const allText = file.get('allText')
  allText.push({
    key,
    value,
  })

  file.set('allText', allText)
}
/**
 * hash处理字符串
 * @param key
 * @returns
 */
export function hash(key: string) {
  return crypto.createHash('sha1').update(`${key}`).digest('hex')
}
/**
 * 转换key
 * @param {string} key
 * @returns
 */
export function transformKey(key: string) {
  return hash(key).substring(0, 8)
}
