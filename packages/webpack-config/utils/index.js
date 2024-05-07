const HtmlWebpackPlugin = require('html-webpack-plugin')

const templateContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <title>webpack example</title> 
</head>
<body>
  <div id="root"></div>
</body>
</html>`
const meta = {
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
}

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
    // TODO LOADING 主题变量
    templateContent: () => templateContent,
    meta,
  })

module.exports = { getHtmWebpackPlugin, meta, templateContent }
