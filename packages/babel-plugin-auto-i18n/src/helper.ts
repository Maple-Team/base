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
