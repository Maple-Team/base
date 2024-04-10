import * as parser from '@babel/parser'
import type { PluginItem } from '@babel/core'
import { transformFromAstSync } from '@babel/core'
import plugin from '../src'

/**
 * 构建preset
 * @returns
 */
export function preset1() {
  return {
    plugins: [
      [
        plugin,
        {
          name: 'name1',
        },
      ],
    ],
  }
}
/**
 * 构建preset
 * @returns
 */
export function preset2() {
  return {
    plugins: [
      [
        plugin,
        {
          name: 'name2',
        },
      ],
    ],
  }
}
/**
 * 同步转换代码
 * @param sourceCode
 * @returns
 */
export const getTransformCode = (sourceCode: string, filename: string) => {
  // @https://babeljs.io/docs/babel-parser
  const ast = parser.parse(sourceCode, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript'],
    sourceFilename: filename,
  })
  const presets = [
     '@babel/preset-react',  preset1, '@babel/preset-typescript'] as PluginItem[]

  // @https://babeljs.io/docs/babel-core
  const result = transformFromAstSync(ast, sourceCode, {
    filename,
    presets,
  })
  return result
}
