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
