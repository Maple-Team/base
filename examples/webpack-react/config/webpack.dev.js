const { merge } = require('webpack-merge')
const base = require('./webpack.base')
const path = require('path')
/**
 * @type {import("webpack-dev-server").Configuration}
 */
const devServer = {
  compress: false,
  port: 3000,
  hot: true,
  client: {
    overlay: false,
  },
}
/**
 * @type {import("webpack").Configuration}
 */
const dev = {
  mode: 'development',
  output: { filename: 'main.js', path: path.resolve(__dirname, '../dist'), pathinfo: false },
  devtool: 'eval-cheap-module-source-map',
  cache: true,
  // cache: {
  //   type: 'filesystem',
  //   cacheDirectory: path.resolve(__dirname, '../node_modules/'),
  // },
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        exclude: /node_modules/,
        include: [path.resolve(__dirname, '../src'), path.resolve(__dirname, '../../../packages')],
        use: ['babel-loader', 'maple-pattern-loader'],
      },
    ],
  },

  optimization: {
    usedExports: true,
  },
  resolveLoader: {
    alias: {
      'maple-pattern-loader': path.resolve(__dirname, '../plugins/maple-pattern-loader.js'),
    },
  },
  devServer,
  infrastructureLogging: {
    debug: true,
  },
}
const config = merge(base, dev)

module.exports = config
