const path = require('path')
const { dev, meta, templateContent } = require('@liutsing/webpack-config')
const { merge } = require('webpack-merge')
const webpack = require('webpack')
const MapleHtmlWebpackPlugin = require('@liutsing/html-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const config = merge(dev, {
  entry: path.resolve(__dirname, '../src/main.tsx'),
  mode: 'development',
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  plugins: [
    new webpack.DllReferencePlugin({
      context: process.cwd(),
      manifest: require(path.join(__dirname, '../public', 'vendor-manifest.json')),
    }),
    new HtmlWebpackPlugin({
      inject: true,
      hash: true, // 文件连接hash值
      cache: true,
      templateContent: () => templateContent,
      meta,
    }),
    new MapleHtmlWebpackPlugin([{ tagName: 'script', src: 'vendor.bundle.js' }], 'head'),
  ],
})

module.exports = config
