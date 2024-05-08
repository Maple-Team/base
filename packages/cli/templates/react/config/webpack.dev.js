const path = require('path')
const { dev, meta, templateContent } = require('@liutsing/webpack-config')
const { merge } = require('webpack-merge')
const MapleHtmlWebpackPlugin = require('@liutsing/html-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const config = merge(dev, {
  entry: path.resolve(__dirname, '../src/main.tsx'),
  watchOptions: {
    ignored: ['**/public/fonts', '**/node_modules'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      hash: true,
      cache: true,
      templateContent: () => templateContent,
      meta,
    }),
    new MapleHtmlWebpackPlugin([], 'head'),
  ],
})

module.exports = config
