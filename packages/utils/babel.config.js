module.exports = function (api) {
  api.assertVersion(7)
  api.cache(true)

  console.log('core-js', require('core-js/package.json').version)
  const corejsVersion = 3
  // 兼容性
  const targets = {
    // es6
    chrome: 58,
  }

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          modules: false,
          useBuiltIns: false, // 'usage', 是否注入"core-js/x"样的polyfill
          corejs: require('core-js/package.json').version,
          targets,
          debug: true,
        },
      ],
      '@babel/preset-typescript',
    ],
    plugins: [
      [
        '@babel/plugin-transform-runtime',
        {
          regenerator: true,
          corejs: corejsVersion,
          helpers: true,
          version: require('@babel/runtime-corejs3/package.json').version,
        },
      ],
      '@babel/plugin-proposal-class-properties',
    ],
    env: {
      test: {
        presets: ['@babel/preset-env', '@babel/preset-typescript'],
        plugins: [
          [
            '@babel/plugin-transform-runtime',
            {
              version: require('@babel/runtime/package.json').version,
            },
          ],
          '@babel/plugin-proposal-class-properties',
        ],
      },
      // 环境变量
      commonjs: {
        presets: [
          [
            '@babel/preset-env',
            {
              useBuiltIns: false, // 'usage', 是否注入"core-js/x"样的polyfill
              corejs: require('core-js/package.json').version,
              modules: 'cjs',
              targets,
              debug: true,
            },
          ],
          '@babel/preset-typescript',
        ],
        plugins: [
          [
            '@babel/plugin-transform-runtime',
            {
              regenerator: true,
              corejs: corejsVersion,
              helpers: true,
              version: require('@babel/runtime-corejs3/package.json').version,
            },
          ],
          '@babel/plugin-proposal-class-properties',
        ],
      },
    },
  }
}
