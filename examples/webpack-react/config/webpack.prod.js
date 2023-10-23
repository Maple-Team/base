const path = require('path')
const { prod } = require('@liutsing/webpack-config')
const { merge } = require('webpack-merge')
const FontMinifyPlugin = require('../plugins/fontMinifyPlugin')

module.exports = merge(
  {
    entry: path.resolve(__dirname, '../src/main.tsx'),
    module: {
      rules: [
        {
          test: /\.(j|t)sx?$/,
          exclude: /node_modules/,
          include: [path.resolve(__dirname, './src/assets/svg-icons')],
          use: ['babel-loader'],
        },
      ],
    },
    plugins: [new FontMinifyPlugin()],
  },
  prod
)
