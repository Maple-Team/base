module.exports = function (api) {
  api.assertVersion(7)
  api.cache(true)

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          modules: false,
          // useBuiltIns: 'usage',
          corejs: 3,
          helpers: true,
          targets: {
            node: 'current',
          },
        },
      ],
      '@babel/preset-typescript',
      '@babel/preset-react',
    ],
    plugins: [
      [
        '@babel/plugin-transform-runtime',
        {
          version: require('@babel/runtime/package.json').version,
          corejs: 3,
        },
      ],
      '@babel/plugin-proposal-class-properties',
    ],
    env: {
      test: {
        presets: ['@babel/preset-env', '@babel/preset-typescript', '@babel/preset-react'],
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
      commonjs: {
        presets: [
          [
            '@babel/preset-env',
            {
              useBuiltIns: 'usage',
              corejs: 3,
              targets: {
                chrome: 58,
              },
            },
          ],
          '@babel/preset-typescript',
          '@babel/preset-react',
        ],
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
    },
  }
}
