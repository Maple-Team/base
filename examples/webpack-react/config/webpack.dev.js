const path = require('path')
const { dev } = require('@liutsing/webpack-config')
const { merge } = require('webpack-merge')
const base = require('./webpack.base')
// const ErrorOverlayPlugin = require('../plugins/errorOverlayMiddleware.js')

module.exports = merge(base, dev, {
  entry: path.resolve(__dirname, '../src/app.tsx'),
  resolve: {
    alias: {
      react: path.resolve(__dirname, '../../../node_modules/react'),
      'react-dom': path.resolve(__dirname, '../../../node_modules/react-dom'),
    },
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  watchOptions: {
    ignored: ['**/public/fonts', '**/public/fonts/mini', '**/node_modules'],
  },
})
