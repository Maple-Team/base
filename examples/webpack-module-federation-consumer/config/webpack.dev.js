const path = require('path')
const { dev, meta, templateContent } = require('@liutsing/webpack-config')
const { merge } = require('webpack-merge')
const MapleHtmlWebpackPlugin = require('@liutsing/html-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { ModuleFederationPlugin } = require('webpack').container
const ExternalTemplateRemotesPlugin = require('external-remotes-plugin')

const config = merge(dev, {
  entry: path.resolve(__dirname, '../src/index.ts'),
  output: {
    publicPath: 'auto',
  },
  optimization: {
    runtimeChunk: false, // <- 影响重大
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
      name: 'mfconsumer',
      remotes: {
        mfprovider: 'mfprovider@[mfproviderUrl]/remoteEntry.js',
      },
      shared: { react: { singleton: true }, 'react-dom': { singleton: true } },
    }),
    new ExternalTemplateRemotesPlugin(),
  ],
})

module.exports = config
