import type { PluginPass } from '@babel/core'
import { hash } from '@liutsing/node-utils'

/**
 * 收集存在的key
 * @param {*} file
 * @param {*} value
 * @returns
 */
/* istanbul ignore next */
export function save(file: PluginPass, key: string, value: string) {
  const allText = file.get('allText')
  allText.push({
    key,
    value,
  })

  file.set('allText', allText)
}
/**
 * 转换key
 * @param {string} key
 * @returns
 */
export function transformKey(key: string) {
  return hash(key).substring(0, 8)
}

/**
 * 转换key
 * @param {string} key
 * @returns
 */
export function transformKeyWithoutHash(key: string) {
  return `key_${key}`
}
/**
 * 配置项
 */
export interface Option {
  /**
   * 中文文案输出目录
   * @default string path.join(process.cwd(), 'src','i18n','zh_CN')
   */
  outputDir?: string
  /**
   * 是否开启debug
   */
  debug?: boolean
  /**
   * 提取/转化符合条件的语言文案
   * @param text
   * @default {import('./helper').isHans}
   * @returns
   */
  conditionalLanguage?: (text: string) => boolean
  /**
   * hash函数
   */
  hashFn?: (text: string) => string
  /**
   * 父节点信息debug
   */
  stringLiteralParentTypeDebug?: boolean
  /**
   * 需要删除id的节点名称
   */
  needDeleteAttributeElementNames?: string[]
  /**
   * 忽略注释文案
   */
  i18nIgnoreCommentsLabel?: string
  /**
   * 是否注入data-i18n属性
   */
  shouldInjectDataI18nAttribute?: boolean
  /**
   * data-i18n属性名称
   */
  dataI18nAttributeName?: string
}
