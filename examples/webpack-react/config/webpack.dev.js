const { merge } = require('webpack-merge')
const base = require('./webpack.base')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
/**
 * @type {import("webpack").Configuration}
 */
const dev = {
  mode: 'development',
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(__dirname, '../public/index.html'),
      title: 'webpack config demo',
    }),
  ],
  optimization: {
    usedExports: true,
  },
}
const config = merge(base, dev)

module.exports = config
