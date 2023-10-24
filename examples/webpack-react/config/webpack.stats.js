const { stats } = require('@liutsing/webpack-config')
const { merge } = require('webpack-merge')

module.exports = merge(stats, {
  mode: 'development',
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
})
