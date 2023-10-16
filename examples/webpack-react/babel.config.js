const mode = process.env.NODE_ENV
module.exports = (api) => {
  api.assertVersion(7)
  api.cache(true)
  return {
    presets: [
      [
        '@babel/preset-env',
        {
          useBuiltIns: 'usage',
          corejs: '3.26.1',
        },
      ],
      '@babel/preset-react',
      '@babel/preset-typescript',
    ],
    plugins: [
      '@babel/plugin-transform-runtime',
      ['@liutsing/babel-plugin-extract-used-chinese', { app: 'example-webpack-react' }],
      mode === 'development' ? 'react-refresh/babel' : null,
      [
        '@liutsing/babel-plugin-remove-console',
        {
          exclude: ['debug', 'error', 'warn'],
        },
      ],
      // [
      //   "import",
      //   {
      //     "libraryName": "lodash",
      //     "libraryDirectory": "",
      //     "camel2DashComponentName": false // default: true
      //   }
      // ]
    ].filter(Boolean),
    env: {
      test: {
        presets: [
          [
            '@babel/preset-env',
            {
              targets: {
                node: true,
              },
              modules: 'commonjs',
            },
          ],
        ],
      },
    },
  }
}
