const pkg = require('./package.json')
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
          useBuiltIns: api.env('development') ? false : 'usage',
          corejs: '3.33.1',
          modules: false,
          targets: {
            browsers: pkg.browserslist,
          },
          bugfixes: true,
          debug: api.env('development'),
        },
      ],
      ['@babel/preset-react', { development: api.env('development'), runtime: 'automatic' }],
      '@babel/preset-typescript',
    ],
    plugins: [
      api.env('development')
        ? [
            // When this plugin is enabled, the useBuiltIns option in @babel/preset-env must not be set. Otherwise, this plugin may not able to completely sandbox the environment.
            '@babel/plugin-transform-runtime',
            {
              regenerator: true,
              corejs: 3,
              helpers: true,
              useESModules: true,
              version: '^7.24.3',
            },
          ]
        : null,
      !api.env('production') ? 'react-refresh/babel' : null,
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
  return config
}
// https://babeljs.io/docs/babel-plugin-transform-runtime#technical-details
// https://babeljs.io/docs/babel-plugin-transform-runtime#absoluteruntime
// https://babeljs.io/docs/babel-preset-env
