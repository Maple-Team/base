const path = require('path')
const { dev } = require('@liutsing/webpack-config')
const { merge } = require('webpack-merge')
const TestPlugin = require('../plugins/testPlugin')

const config = merge(dev, {
  entry: path.resolve(__dirname, '../src/main.tsx'),
  mode: 'development',
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
  plugins: [new TestPlugin()],
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        exclude: /node_modules/,
        include: [path.resolve(__dirname, './src/assets/svg-icons')],
        use: ['babel-loader'],
      },
    ],
  },
})

module.exports = config
