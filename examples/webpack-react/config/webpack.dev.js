const path = require('path')
const os = require('os')
const { dev } = require('@liutsing/webpack-config')
const { merge } = require('webpack-merge')
const FontMinifyPlugin = require('@liutsing/font-minify-plugin')

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
    ignored: ['**/public/fonts', '**/node_modules'],
  },
  plugins: [
    new FontMinifyPlugin({
      words: path.resolve(os.tmpdir(), 'example-webpack-react.txt'),
      fontSource: path.resolve(__dirname, '../../../packages/font-minify-plugin/puhui2/AlibabaPuHuiTi_2_65_Medium.ttf'),
      fontDistFilename: 'AlibabaPuHuiTi_2_65_Medium',
    }),
    new FontMinifyPlugin({
      words: '魑魅魍魉',
      isFilePath: false,
    }),
  ],
})

module.exports = config
