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
    presets: [
      [
        '@babel/preset-env',
        {
          useBuiltIns: 'usage',
          corejs: '3.33.1',
          modules: false,
          targets: {
            browsers: pkg.browserslist,
          },
          bugfixes: true,
          // debug: api.env('development'),
        },
      ],
      ['@babel/preset-react', { development: api.env('development'), runtime: 'automatic' }],
      '@babel/preset-typescript',
    ],
    plugins: [
      api.env('production')
        ? [
            // When this plugin is enabled, the useBuiltIns option in @babel/preset-env must not be set. Otherwise, this plugin may not able to completely sandbox the environment.
            '@babel/plugin-transform-runtime',
            {
              regenerator: true,
              corejs: 3,
              // FIXME error
              // moduleName: '@babel/runtime-corejs3',
              // Module not found: Error: Package path ./helpers/esm/callSuper is not exported from package /root/maple/base/examples/webpack-react/node_modules/@babel/runtime-corejs3 (see exports field in /root/maple/base/examples/webpack-react/node_modules/@babel/runtime-corejs3/package.json)
              helpers: false,
              useESModules: true,
              version: '^7.24.3',
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
