/* file: test/unit.test.js */

import pluginTester from 'babel-plugin-tester'
import removeConsolePlugin from '../src/'

pluginTester({
  plugin: removeConsolePlugin,
  pluginOptions: { exclude: ['debug', 'error', 'warn'] },
  pluginName: '@liutsing/babel-plugin-remove-console',
  snapshot: true,
  presets: ['@babel/preset-env', '@babel/preset-typescript'],
  babelOptions: {
    filename: __filename,
  },
  tests: [
    {
      code: 'console.log(1)',
      output: '',
    },
    {
      snapshot: false,
      code: 'console.debug(1)',
      output: 'console.debug(1)',
    },
    {
      snapshot: false,
      code: 'console.warn(1)',
      output: 'console.warn(1)',
    },
    {
      snapshot: false,
      code: 'console.error(1)',
      output: 'console.error(1)',
    },
  ],
})
// TODO add jest test code
// describe('remove-console-logs', () => {
//   it('should remove console.log calls', () => {
//     const code = `console.log('test')`
//     const { code: transformed } = transform(code, { plugins: [[plugin, { exclude: ['log'] }]] })!
//     expect(transformed).to.equal('')
//   })
// })

// describe('remove-console-logs', () => {
//   it('should not remove console.error calls', () => {
//     const code = `console.error('test')`
//     const { code: transformed } = transform(code, { plugins: [[plugin, { exclude: ['log'] }]] })!
//     expect(transformed).to.equal(`console.error('test');`)
//   })
// })

// describe('removeConsolePlugin', () => {
//   it('removes console.log statement', () => {
//     const code = console.log('Hello, World!')
//     const expected = ''
//     const opts = { exclude: [] }
//     const result = plugin?.({ types: t }, { opts }).visitor.CallExpression(code)
//     expect(result).toBe(expected)
//   })

//   it('does not remove console.debug statement', () => {
//     const code = console.debug('Hello, World!')
//     const expected = console.debug('Hello, World!')
//     const opts = { exclude: ['log'] }
//     const result = plugin?.({ types: t }, { opts }).visitor.CallExpression(code)
//     expect(result).toBe(expected)
//   })
// })

// describe('babel-plugin-remove-console-logs', () => {
//   let types: typeof import('@babel/types')
//   let removeConsoleLogs: ReturnType<typeof import('../src')>

//   beforeEach(() => {
//     types = require('@babel/types')
//     removeConsoleLogs = plugin({ types })
//   })

//   it('should remove console.log calls', () => {
//     const result = removeConsoleLogs.visitor.CallExpression(
//       { node: { callee: { object: { name: 'console' }, property: { name: 'log' } } }, remove: jest.fn() },
//       { opts: { exclude: [] } }
//     )
//     expect(result).toBeUndefined()
//   })

//   it('should not remove console.info calls', () => {
//     const result = removeConsoleLogs.visitor.CallExpression(
//       { node: { callee: { object: { name: 'console' }, property: { name: 'info' } } }, remove: jest.fn() },
//       { opts: { exclude: [] } }
//     )
//     expect(result).toBeUndefined()
//   })

//   it('should not remove excluded console.log calls', () => {
//     const result = removeConsoleLogs.visitor.CallExpression(
//       { node: { callee: { object: { name: 'console' }, property: { name: 'log' } } }, remove: jest.fn() },
//       { opts: { exclude: ['log'] } }
//     )
//     expect(result).toBeUndefined()
//   })
// })
