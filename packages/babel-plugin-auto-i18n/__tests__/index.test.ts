import * as parser from '@babel/parser'
import { transformFromAstSync } from '@babel/core'
import autoI18nPlugin from '../'

function preset() {
  return {
    plugins: [
      [
        autoI18nPlugin,
        {
          outputDir: 'output',
        },
      ],
    ],
  }
}

describe('auto i18n plugin', () => {
  it('handle JSXText', () => {
    const sourceCode = `
    export const Component = () => {
      return <div>你好</div>
    }
    `
    // @https://babeljs.io/docs/babel-parser
    const ast = parser.parse(sourceCode, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript'],
      sourceFilename: 'test.tsx',
    })

    // @https://babeljs.io/docs/babel-core
    const result = transformFromAstSync(ast, sourceCode, {
      filename: 'test.tsx',
      presets: [
        // '@babel/preset-react', -> 保留了 jsx
        preset,
        '@babel/preset-typescript',
      ],
    })
    console.log(result?.code)
    expect(result?.code).toMatchSnapshot()
  })
  it('handle JSXAttribute', () => {
    const sourceCode = `
    export const Component = () => {
      return <div name="属性">jsx文本</div>
    }
    `
    // @https://babeljs.io/docs/babel-parser
    const ast = parser.parse(sourceCode, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript'],
      sourceFilename: 'test.tsx',
    })

    // @https://babeljs.io/docs/babel-core
    const result = transformFromAstSync(ast, sourceCode, {
      filename: 'test.tsx',
      presets: [
        // '@babel/preset-react', -> 保留了 jsx
        preset,
        '@babel/preset-typescript',
      ],
    })
    console.log(result?.code)
    expect(result?.code).toMatchSnapshot()
  })
})
