const path = require('path')
const { merge } = require('webpack-merge')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const base = require('./webpack.base')

const root = process.cwd()
/**
 * @type {import("webpack").Configuration}
 */
const prod = {
  mode: 'development',
  output: {
    path: path.resolve(root, './dist'),
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
        include: [path.resolve(root, './src')],
        use: ['babel-loader'],
      },
    ],
  },
  optimization: {
    // runtimeChunk: true,
    splitChunks: {
      chunks: 'async',
      // cacheGroups: {
      //   defaultVendors: {
      //     test: /[\\/]node_modules[\\/]/,
      //     priority: -10,
      //     reuseExistingChunk: true,
      //   },
      //   default: {
      //     minChunks: 2,
      //     priority: -20,
      //     reuseExistingChunk: true,
      //   },
      // },
    },
  },
}
const config = merge(base, prod)

module.exports = config
