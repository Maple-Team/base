const { merge } = require('webpack-merge')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const base = require('./webpack.base')

/**
 * @type {import("webpack").Configuration}
 */
const prod = {
  mode: 'production',
  devtool: 'hidden-source-map',
  performance: {
    hints: 'warning',
  },
  plugins: [new ForkTsCheckerWebpackPlugin()],
  optimization: {
    // runtimeChunk: true,
    splitChunks: {
      // TODO
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
