const pkg = require('./package.json')
const path = require('path')
const fs = require('fs')

/**
 * 创建Babel配置的函数
 * @type {import('@babel/core').ConfigFunction} api
 * @returns
 */
module.exports = (api) => {
  api.cache.using(() => process.env.NODE_ENV)

  /**
   * @type {import('@babel/core').TransformOptions}
   */
  const config = {
    sourceType: 'module',
    presets: [
      [
        '@babel/preset-env',
        {
          useBuiltIns: 'usage',
          corejs: 3,
          modules: false,
          targets: {
            browsers: pkg.browserslist,
          },
          bugfixes: true,
          debug: api.env('development'), // 展示每个文件的polyfill
          exclude: ['transform-typeof-symbol'],
        },
      ],
      ['@babel/preset-react', { development: api.env('development'), runtime: 'automatic' }],
      '@babel/preset-typescript',
    ],
    plugins: [
      !api.env('production')
        ? [
            // When this plugin is enabled, the useBuiltIns option in @babel/preset-env must not be set. Otherwise, this plugin may not able to completely sandbox the environment.
            '@babel/plugin-transform-runtime',
            {
              absoluteRuntime: false, // 路径自动处理
              regenerator: true, // 默认开启 In older Babel version, this option used to toggles whether or not generator functions were transformed to use a regenerator runtime that does not pollute the global scope.
              corejs: 3,
              helpers: true, // 是否不注入行内Babel helpers polyfill方法. 默认开启 Toggles whether or not inlined Babel helpers (classCallCheck, extends, etc.) are replaced with calls to @babel/runtime (or equivalent package).
              useESModules: true, // 废弃了
              version: require('@babel/runtime-corejs3/package.json').version, // 确定@babel/runtime版本信息
              // version: require('@babel/runtime/package.json').version,
            },
          ]
        : null,
      api.env('development') ? 'react-refresh/babel' : null,
      api.env('production')
        ? [
            '@liutsing/babel-plugin-remove-console',
            {
              exclude: ['debug', 'error', 'warn'],
            },
          ]
        : null,
    ].filter(Boolean),
    env: {
      test: {
        presets: [
          [
            '@babel/preset-env',
            {
              targets: {
                node: 'current',
              },
            },
          ],
          '@babel/preset-react',
          '@babel/preset-typescript',
        ],
      },
    },
  }

  const configStr = JSON.stringify(config, null, 2)
  fs.writeFile(path.resolve(__dirname, './config/babel-config.json'), configStr, (err) => {
    if (err) {
      console.log(err)
    }
  })

  return config
}
// https://babeljs.io/docs/babel-plugin-transform-runtime#technical-details
// https://babeljs.io/docs/babel-plugin-transform-runtime#absoluteruntime
// https://babeljs.io/docs/babel-preset-env
