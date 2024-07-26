const path = require('path')
const { merge } = require('webpack-merge')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const base = require('./webpack.base')

const root = process.cwd()

/**
 * @type {import("webpack-dev-server").Configuration}
 */
const devServer = {
  headers: { 'X-Upstream': process.env.API_URL, 'Access-Control-Allow-Origin': '*' },
  port: process.env.PORT,
  host: process.env.HOST,
  hot: true,
  liveReload: false,
  open: false,
  setupExitSignals: true,
  historyApiFallback: true,
  // Provide options to [webpack-dev-middleware](https://github.com/webpack/webpack-dev-middleware) which handles webpack assets.
  devMiddleware: {
    // true: 写入本地文件，方便开发下查看输出的产物，方便调试一些babel插件
    writeToDisk: false,
  },
  // 适用于开发环境
  static: {
    // https://webpack.js.org/configuration/dev-server/#devserverstatic
    directory: path.resolve(root, 'public'),
  },
  proxy: [
    {
      context: ['/api'],
      target: process.env.API_URL,
      secure: false,
      changeOrigin: true, // NOTE 很重要
    },
    {
      context: ['/ws-service'], // NOTE 避免与内置的/ws请求冲突
      target: process.env.WS_URL,
      ws: true,
      secure: false,
      changeOrigin: true,
      pathRewrite: {
        '^/ws-service': '/ws',
      },
    },
  ],
  client: {
    logging: 'error',
    overlay: false,
  },
}
/**
 * @type {import("webpack").Configuration}
 */
const dev = {
  mode: 'development',
  // cheap-module-source-map ->  输出的代码可读性较好，性能较差
  // eval-cheap-module-source-map ->  输出的代码可读性较差，性能较好
  devtool: 'cheap-module-source-map',
  plugins: [
    new ReactRefreshWebpackPlugin({
      overlay: false, // NOTE 是否以遮挡的形式展示错误
      library: 'reactRefreshWebpackPlugin',
    }),
  ],
  cache: true,
  optimization: {
    runtimeChunk: true,
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false,
  },
  devServer,
  infrastructureLogging: {
    appendOnly: true,
    level: 'verbose',
    debug: true,
  },
  output: {
    pathinfo: true,
    clean: true,
    path: path.resolve(root, './dist'),
    filename: '[name].[chunkhash:8].js',
    chunkFilename: '[name].[chunkhash:8].chunk.js',
  },
  //   watchOptions: {
  //     aggregateTimeout: 600, // 在第一个文件更改后，添加一个延迟再进行重新构建。这样可以让webpack在此期间聚合其他任何更改，并进行一次重新构建。单位：ms
  //     poll: 100, // 轮询时长 单位：ms
  //     ignored: ['**/node_modules'],
  //     stdin: true,
  //     followSymlinks: false, // 在查找文件时，跟随符号链接。This is usually not needed as webpack already resolves symlinks with `resolve.symlinks`.
  //   },
  watchOptions: {
    // 忽略字体文件的变化
    ignored: /\.woff2?/,
  },
  experiments: {
    lazyCompilation: true,
  },
}
const config = merge(base, dev)

module.exports = config
