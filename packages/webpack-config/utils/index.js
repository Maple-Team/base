const HtmlWebpackPlugin = require('html-webpack-plugin')

/**
 * 获取HtmlWebpackPlugin实例
 * TODO 传入参数
 * @returns
 */
const getHtmWebpackPlugin = (hash = true) =>
  new HtmlWebpackPlugin({
    inject: true,
    hash, // 文件连接hash值
    cache: false,
    templateContent: () => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <title>webpack example</title>
    </head>
    <body>
      <!-- // TODO LOADING 主题变量-->
      <div id="app"></div>
    </body>
  </html>
    `,
    meta: {
      _: {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
      },
      a: {
        'http-Equiv': 'Content-Type',
        content: 'text/html; charset=utf-8',
      },
      b: {
        'http-equiv': 'X-UA-Compatible',
        content: 'IE=edge',
      },
      c: {
        'http-equiv': 'expires',
        content: 'Wed, 26 Feb 1997 08:21:57 GMT',
      },
      d: {
        'http-equiv': 'pragma',
        content: 'no-cache',
      },
      e: {
        'http-equiv': 'Cache-Control',
        content: 'no-store, must-revalidate',
      },
    },
  })

module.exports = { getHtmWebpackPlugin }
