const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const { merge } = require('webpack-merge')
const prod = require('./webpack.prod')

/**
 * @type {import("webpack").Configuration}
 */
const stats = {
  mode: 'production',
  stats: 'detailed',
  plugins: [
    new BundleAnalyzerPlugin({
      open: false,
      openAnalyzer: false,
      analyzerPort: 8888,
    }),
  ],
}
const config = merge(prod, stats)

module.exports = config
