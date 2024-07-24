const { prod, templateContent, meta } = require('@liutsing/webpack-config')
const { merge } = require('webpack-merge')
const MapleHtmlWebpackPlugin = require('@liutsing/html-webpack-inject-plugin').default
const HtmlWebpackPlugin = require('html-webpack-plugin')

const useLocalHtmlWebpackPlugin = process.env.USE_LOCAL_HTML_WEBPACK_PLUGIN === 'true' || false
if (useLocalHtmlWebpackPlugin) {
  const htmlPluginIndex = prod.plugins.findIndex((plugin) => plugin instanceof HtmlWebpackPlugin)
  prod.plugins.splice(htmlPluginIndex >>> 0, 1)
}

module.exports = merge(prod, {
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
    new MapleHtmlWebpackPlugin(
      [
        {
          tagName: 'script',
          content: `
              <script>
        window.addEventListener('error', (e)=>{
            console.error(e)
        })
      </script>`,
        },
      ],
      'head'
    ),
  ],
})
