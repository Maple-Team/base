import * as parser from '@babel/parser'
import type { PluginItem } from '@babel/core'
import { transformFromAstSync } from '@babel/core'
import autoI18nPlugin, { transformKeyWithoutHash } from '../src'
// import { hash } from '@liutsing/node-utils'
/**
 * 构建preset
 * @returns
 */
export function preset() {
  return {
    plugins: [
      [
        autoI18nPlugin,
        {
          outputDir: 'output',
          debug: false,
          // hashFn: (v:string)=>hash(v).substring(0, 8),
          hashFn: transformKeyWithoutHash,
          // i18nIgnoreLabel: '@i18n-ignore',
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
export const getTransformCode = (sourceCode: string, filename: string, useReactPreset = false) => {
  // @https://babeljs.io/docs/babel-parser
  const ast = parser.parse(sourceCode, {
    sourceType: 'unambiguous',
    plugins: ['jsx', 'typescript'],
    sourceFilename: filename,
  })
  const presets = [useReactPreset ? '@babel/preset-react' : null, preset, '@babel/preset-typescript'].filter(
    Boolean
  ) as PluginItem[]

  // @https://babeljs.io/docs/babel-core
  const result = transformFromAstSync(ast, sourceCode, {
    filename,
    presets,
  })
  return result
}
