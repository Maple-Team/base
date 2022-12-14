/**
 * 中文字符正则
 */
export const chineseRegexp =
  /[\u4E00-\u9FCC\u3400-\u4DB5\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\ud840-\ud868][\udc00-\udfff]|\ud869[\udc00-\uded6\udf00-\udfff]|[\ud86a-\ud86c][\udc00-\udfff]|\ud86d[\udc00-\udf34\udf40-\udfff]|\ud86e[\udc00-\udc1d]/
/**
 * 颜色正则
 */
export const colorReg = /^#[0-9a-f]{6}$/
/**
 * 匹配的标签
 */
export const pairTagReg = /<([^>]+)>.*?<\/\1>/
/**
 * 匹配的引号：单引号或双引号
 * \1: 表示匹配到的第一个group
 */
export const pairQuoteReg = /^(['"])(.+)\1$/

export const cssPropertyReg = /^(['"])\$(.+)\1$/
