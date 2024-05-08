const path = require('path')
const { dev, meta, templateContent } = require('@liutsing/webpack-config')
const { merge } = require('webpack-merge')
const MapleHtmlWebpackPlugin = require('@liutsing/html-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { ModuleFederationPlugin } = require('webpack').container
/**
 * @type {import('webpack').Configuration}
 */
const config = merge(dev, {
  entry: path.resolve(__dirname, './src/index.ts'),
  output: {
    publicPath: 'auto',
  },
  optimization: {
    runtimeChunk: 'single',
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      hash: true,
      cache: true,
      templateContent: () => templateContent,
      meta,
    }),
    new MapleHtmlWebpackPlugin([], 'head'),
    new ModuleFederationPlugin({
      name: 'mfprovider',
      filename: 'remoteEntry.js',
      exposes: {
        './Button': './src/Button',
      },
      shared: { react: { singleton: true }, 'react-dom': { singleton: true } },
    }),
  ],
})

module.exports = config
