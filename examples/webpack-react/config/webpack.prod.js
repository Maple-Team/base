const { prod } = require('@liutsing/webpack-config')
const { merge } = require('webpack-merge')
const base = require('./webpack.base')

module.exports = merge(base, prod)
