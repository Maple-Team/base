const path = require('path')
const { prod } = require('@liutsing/webpack-config')
const { merge } = require('webpack-merge')

module.exports = merge(
  {
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
  },
  prod
)
