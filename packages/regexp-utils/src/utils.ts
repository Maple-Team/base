/* eslint-disable @typescript-eslint/quotes */
import { pairTagReg, stringLiteralReg } from './reg'

/**
 * 格式化输入
 * @param str
 * @returns
 */
export const convert = (str: string): string => {
  return str.replace(/(?<=\d{3})\d+/, ($0) => `,${$0}`).replace(/(?<=[,\d]{8})\d+/, ($0) => `,${$0}`) // NOTE 特例情况
}
/**
 * 提取中间关键字符, 使用的分组引用
 * @param input
 * @returns
 */
export const trim = (input: string): string => {
  return input.replace(/^\s*(.*?)\s*$/, '$1')
}
/**
 * 去掉开头和结尾的空字符
 * @param input
 * @returns
 */
export const trim2 = (input: string): string => {
  return input.replace(/^\s*|\s*$/g, '')
}
/**
 * 首字母大写
 * 非捕获性括号
 * @param input
 * @returns
 */
export const wordUppercase = (input: string): string => {
  return input.toLowerCase().replace(/(?:^|\s)\w/g, (c) => c.toUpperCase())
}
/**
 * 横向转驼峰
 * 非捕获性括号
 * @param input
 * @returns
 */
export const word2CamelCase = (input: string): string => {
  return input.toLowerCase().replace(/(?:^|-)(\w)/g, (_, $1) => $1.toUpperCase())
}
/**
 * 驼峰化
 * @param input
 * @returns
 */
export const camelCase = (input: string): string => {
  return input.toLowerCase().replace(/[\s-_]+(\w)/g, (_, $1) => $1.toUpperCase())
}
/**
 * 中划线化
 * @param input
 * @returns
 */
export const dasherize = (input: string): string => {
  return input.replace(/[A-Z]/g, ($0) => `-${$0.toLowerCase()}`)
}
const ESCAPECHARS = {
  '<': 'lt',
  '>': 'gt',
  '"': 'quot',
  "'": 'apos',
  '&': 'amp',
}
type EscapeChars = keyof typeof ESCAPECHARS
const HTMLENTITIES = {
  nbsp: ' ',
  lt: '<',
  gt: '>',
  quot: '"',
  amp: '&',
  apos: "'",
}
type Htmlentities = keyof typeof HTMLENTITIES
/**
 * html转义
 * @param input
 * @returns
 */
export const escapeHTML = (input: string): string => {
  const reg = new RegExp(`[${Object.keys(ESCAPECHARS).join('')}]`, 'g')
  // @ts-expect-error: xx
  return input.replace(reg, (c: EscapeChars) => `&${ESCAPECHARS[c]};`)
}
/**
 * 反转义
 * @param input
 * @returns
 */
export const unescapeHTML = (input: string): string => {
  const reg = /&([^;]+);/g
  return input.replace(reg, (_, c: Htmlentities) => `${HTMLENTITIES[c] || ''}`)
}
/**
 * 匹配成对的标签
 * @param input
 */
export const matchPair = (input: string): boolean => {
  // NOTE 反向引用
  return pairTagReg.test(input)
}

/**
 * 匹配字面量表达式
 *
 * 这两个正则表达式都旨在匹配形如 `${...}` 的模板字符串，但它们在细节上有一些关键的区别：

1. **匹配内容**:
   - `reg1`: 匹配 `${` 开始和 `}` 结束的序列，其中包含非空白字符、非右大括号、非斜杠的字符序列，可能包含点号分隔的属性链。例如，它可以匹配 `${var1}`、`${var1.var2}`。
   - `reg2`: 试图匹配 `${` 开始和 `}` 结束的序列，但表达式 `(\w+\??\.?\w+)+` 的设计有一些问题，可能导致它不能正确匹配期望的模式。

2. **属性链匹配**:
   - `reg1`: 正确匹配点号分隔的属性链，例如 `${object.property}` 或 `${object?.property}`。
   - `reg2`: 试图匹配由 `\w+`（单词字符序列）、`\??`（两个问号）、`\.?`（可选的点号）组成的序列，但这会导致一些问题。特别是，`\??` 实际上不会匹配问号，而是量词，表示前面的元素可以出现 0 次或 1 次。如果你的目的是匹配可选链（`?.`），应该使用 `\\?\.`。

3. **可选链匹配**:
   - `reg1`: 可以匹配可选链 `${object?.property}`，因为它正确地使用了 `[^\s\}\/]+` 来匹配属性名，不限制于 `\w`（字母数字及下划线）。
   - `reg2`: 由于 `\??` 的使用不当，这个正则表达式可能无法正确匹配可选链。

4. **字符类限制**:
   - `reg1`: 使用 `[^\s\}\/]+` 来匹配属性名，这意味着它可以匹配包括下划线、连字符等在内的更多字符。
   - `reg2`: 使用 `\w+`，这限制了匹配范围为字母数字及下划线。

5. **正则表达式结构**:
   - `reg1`: 使用了非捕获组 `(?:...)` 来分组点号分隔的属性，这是正确的方法。
   - `reg2`: 使用了捕获组 `(...)+`，但由于正则表达式的其他部分存在问题，这可能导致不正确的匹配。

6. **全局匹配**:
   - 两者都使用了 `g` 标志来执行全局匹配。

总结来说，`reg1` 是一个更健壮的正则表达式，可以正确匹配包括可选链在内的属性链。而 `reg2` 由于 `\??` 的使用不当，可能无法正确匹配期望的模式。如果你需要匹配模板字符串中的变量和可选链，建议使用类似 `reg1` 的正则表达式，并确保正确处理问号和点号。

 * @param input
 * @returns
 */
export const matchStringLiteral = (input: string) => {
  /**
   * @deprecated
   * 存在问题
   */
  const reg2 = /\$\{(\w+\??\.?\w+)+\}/g
  console.log(reg2)
  return [...input.matchAll(stringLiteralReg)]
}

export const matchStringLiteral2 = (input: string) => {
  return input.match(stringLiteralReg)
}
