const { merge } = require('webpack-merge')
const base = require('./webpack.base')

/**
 * @type {import("webpack").Configuration}
 */
const prod = {
  mode: 'development',
}
const config = merge(base, prod)

module.exports = config
