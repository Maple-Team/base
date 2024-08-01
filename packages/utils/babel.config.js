module.exports = function (api) {
  api.assertVersion(7)
  api.cache(true)

  // 兼容性
  const targets = {
    // es6
    chrome: 58,
  }

  const plugins = [
    [
      '@babel/plugin-transform-runtime',
      {
        regenerator: true,
        corejs: 3,
        helpers: true,
        version: require('@babel/runtime-corejs3/package.json').version,
      },
    ],
    '@babel/plugin-proposal-class-properties',
  ]
  return {
    presets: [
      [
        '@babel/preset-env',
        {
          modules: false,
          useBuiltIns: false, // 'usage', 是否注入"core-js/x"样的polyfill
          // corejs: corejsVersion, The `corejs` option only has an effect when the `useBuiltIns` option is not `false`
          targets,
          debug: true,
        },
      ],
      '@babel/preset-typescript',
    ],
    plugins,
    env: {
      test: {
        presets: ['@babel/preset-env', '@babel/preset-typescript'],
      },
      // 环境变量
      commonjs: {
        presets: [
          [
            '@babel/preset-env',
            {
              useBuiltIns: false, // 'usage', 是否注入"core-js/x"样的polyfill
              // corejs: corejsVersion, The `corejs` option only has an effect when the `useBuiltIns` option is not `false`
              modules: 'cjs',
              targets,
              debug: true,
            },
          ],
          '@babel/preset-typescript',
        ],
        plugins,
      },
    },
  }
}
