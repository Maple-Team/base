const baseWebpackConfig = require('./config/webpack.base')
const devWebpackConfig = require('./config/webpack.dev')
const prodWebpackConfig = require('./config/webpack.prod')
const statsWebpackConfig = require('./config/webpack.stats')
const { getHtmWebpackPlugin, meta, templateContent } = require('./utils')

module.exports = {
  base: baseWebpackConfig,
  dev: devWebpackConfig,
  prod: prodWebpackConfig,
  stats: statsWebpackConfig,
  getHtmWebpackPlugin,
  meta,
  templateContent,
}
