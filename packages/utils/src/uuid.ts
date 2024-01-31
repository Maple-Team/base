// @https://github.com/ai/nanoid

/**
 * 生成uuid
 * @param len 指定长度
 * @param radix 进制
 * @param useBuiltIn 是否使用原生
 * @returns
 */
export function uuid(useBuiltIn = false, len?: number, radix = 16) {
  if (useBuiltIn && crypto) return crypto.randomUUID()
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
    // 8923FB8C-1C81-48D7-904C-23D6A48FF380
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
