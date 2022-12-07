const { merge } = require('webpack-merge')
const base = require('./webpack.base')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const path = require('path')
/**
 * @type {import("webpack").Configuration}
 */
const prod = {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].js',
  },
  devtool: 'hidden-source-map',
  performance: {
    hints: 'warning',
  },
  plugins: [new ForkTsCheckerWebpackPlugin()],
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        exclude: /node_modules/,
        include: [path.resolve(__dirname, '../src'), path.resolve(__dirname, '../../../packages')],
        use: ['babel-loader'],
      },
    ],
  },
}
const config = merge(base, prod)

module.exports = config
