const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const prod = require('./webpack.prod')
const { mergeWithRules } = require('webpack-merge')

/**
 * @type {import("webpack").Configuration}
 */
const stats = {
  stats: 'detailed',
  mode: 'production',
  plugins: [
    new BundleAnalyzerPlugin({
      open: false,
      openAnalyzer: false,
      analyzerPort: 8888,
    }),
  ],
  optimization: {
    minimize: true,
  },
}

const config = mergeWithRules({
  optimization: 'merge',
})(prod, stats)

module.exports = config
