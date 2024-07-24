const path = require('path')
const { dev, meta, templateContent } = require('@liutsing/webpack-config')
const { merge } = require('webpack-merge')
const MapleHtmlWebpackPlugin = require('@liutsing/html-webpack-inject-plugin').default
const HtmlWebpackPlugin = require('html-webpack-plugin')

// NOTE 如果要使用本地的HtmlWebpackPlugin配置的话
const useLocalHtmlWebpackPlugin = process.env.USE_LOCAL_HTML_WEBPACK_PLUGIN === 'true' || false
if (useLocalHtmlWebpackPlugin) {
  const htmlPluginIndex = dev.plugins.findIndex((plugin) => plugin instanceof HtmlWebpackPlugin)
  dev.plugins.splice(htmlPluginIndex >>> 0, 1)
}

const config = merge(dev, {
  entry: path.resolve(__dirname, '../src/main.tsx'),
  watchOptions: {
    ignored: ['**/public/fonts', '**/node_modules'],
  },
  plugins: [
    useLocalHtmlWebpackPlugin
      ? new HtmlWebpackPlugin({
          inject: true,
          hash: false,
          cache: false,
          templateContent: () => templateContent,
          meta,
        })
      : null,
    new MapleHtmlWebpackPlugin([], 'head'),
  ],
})

module.exports = config
