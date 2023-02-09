/**
 * 生成uuid
 * @param len 指定长度
 * @param radix 进制
 * @returns
 */
export function uuid(len: number, radix = 16) {
  const numbers = Array.from({ length: 10 }, (_, i) => `${i}`)
  const upperCaseWords = Array.from({ length: 26 }, (_, i) => i + 65).map((num) => String.fromCharCode(num))
  const lowerCaseWords = Array.from({ length: 26 }, (_, i) => i + 97).map((num) => String.fromCharCode(num))

  const chars = [...numbers, ...upperCaseWords, ...lowerCaseWords]
  const uuid = []
  let i
  radix = radix || chars.length
  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)]
  } else {
    // rfc4122, version 4 form
    let r
    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
    uuid[14] = '4'
    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16)
        uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r]
      }
    }
  }
  return uuid.join('')
}
