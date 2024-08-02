const path = require('path')
const typescript = require('rollup-plugin-typescript2')
const babel = require('@rollup/plugin-babel')
const { extendDeep } = require('@jsmini/extend')
const pkg = require('../package.json')

// https://www.npmjs.com/package/rollup-plugin-typescript2

function getCompiler(tsconfigOpt) {
  tsconfigOpt = extendDeep(
    {
      useTsconfigDeclarationDir: true,
      tsconfig: path.resolve(__dirname, '../tsconfig.build.json'),
      tsconfigOverride: {},
      check: false,
      clean: true,
    },
    tsconfigOpt
  )
  return [
    typescript(tsconfigOpt),
    babel({
      babelrc: false,
      extensions: ['.js', '.mjs', '.ts'],
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              browsers: 'last 2 versions, > 1%, ie >= 11, Android >= 4.1, iOS >= 10.3',
              node: '14',
            },
            modules: false,
            loose: false,
          },
        ],
      ],
      plugins: [
        [
          '@babel/plugin-transform-runtime',
          {
            corejs: 3,
            versions: require('@babel/runtime-corejs3/package.json').version,
            helpers: true,
            regenerator: true,
          },
        ],
      ],
      babelHelpers: 'runtime',
      exclude: 'node_modules/**',
    }),
  ]
}

exports.name = pkg.name
exports.banner = `/*!
 * ${pkg.name} ${pkg.version} (https://github.com/liutsingluo@163.com/mylib)
 * API https://github.com/liutsingluo@163.com/mylib/blob/master/doc/api.md
 * Copyright 2017-${new Date().getFullYear()} liutsingluo@163.com. All Rights Reserved
 * Licensed under MIT (https://github.com/liutsingluo@163.com/mylib/blob/master/LICENSE)
 */
`
exports.getCompiler = getCompiler
