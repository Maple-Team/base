import * as parser from '@babel/parser'
import { transformFromAstSync } from '@babel/core'
import autoI18nPlugin from '../src/index'

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

  // @https://babeljs.io/docs/babel-core
  const result = transformFromAstSync(ast, sourceCode, {
    filename,
    presets: [
      // '@babel/preset-react', -> 保留了 jsx
      preset,
      '@babel/preset-typescript',
    ],
  })
  return result
}
