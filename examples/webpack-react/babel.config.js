module.exports = (api) => {
  api.cache.using(() => process.env.NODE_ENV)

  const config = {
    presets: [
      [
        '@babel/preset-env',
        {
          useBuiltIns: 'usage',
          corejs: '3.26.1',
        },
      ],
      ['@babel/preset-react', { development: !api.env('production'), runtime: 'automatic' }],
      '@babel/preset-typescript',
    ],
    plugins: [
      // '@babel/plugin-transform-runtime',
      ['@liutsing/babel-plugin-extract-used-chinese', { filename: 'example-webpack-react.txt' }],
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
