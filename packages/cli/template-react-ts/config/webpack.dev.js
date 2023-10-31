const path = require('path')
const { dev, getHtmWebpackPlugin } = require('@liutsing/webpack-config')
const { merge } = require('webpack-merge')

const config = merge(dev, {
  entry: path.resolve(__dirname, '../src/main.tsx'),
  mode: 'development',
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  watchOptions: {
    ignored: ['**/public/fonts', '**/node_modules'],
  },
  plugins: [getHtmWebpackPlugin()],
})

module.exports = config
