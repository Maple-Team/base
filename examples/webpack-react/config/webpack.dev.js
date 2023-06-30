const path = require('path')
const { dev } = require('@liutsing/webpack-config')
const { merge } = require('webpack-merge')

module.exports = merge(dev, {
  entry: path.resolve(__dirname, '../src/app.tsx'),
  resolve: {
    alias: {
      react: path.resolve(__dirname, '../../../node_modules/react'),
      'react-dom': path.resolve(__dirname, '../../../node_modules/react-dom'),
    },
  },
})
