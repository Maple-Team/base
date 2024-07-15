const { prod, templateContent, meta } = require('@liutsing/webpack-config')
const { merge } = require('webpack-merge')
const MapleHtmlWebpackPlugin = require('@liutsing/html-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = merge(prod, {
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      hash: true,
      cache: true,
      templateContent: () => templateContent,
      meta,
    }),
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
