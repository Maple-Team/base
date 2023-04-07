const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const { merge } = require('webpack-merge')
const prod = require('./webpack.prod')

/**
 * @type {import("webpack").Configuration}
 */
const stats = {
  mode: 'development',
  // mode: 'production',
  plugins: [
    new BundleAnalyzerPlugin({
      open: false,
      openAnalyzer: false,
    }),
  ],
}
const config = merge(prod, stats)

module.exports = config
