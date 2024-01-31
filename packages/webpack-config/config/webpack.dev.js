const { merge } = require('webpack-merge')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const base = require('./webpack.base')

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
  proxy: {
    '/api': {
      target: process.env.API_URL,
      secure: false,
      changeOrigin: true, // NOTE 很重要
    },
    '/ws/': {
      target: process.env.WS_URL,
      ws: true,
      secure: false,
      changeOrigin: true,
    },
  },
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
  devtool: 'eval-cheap-module-source-map',
  plugins: [
    new ReactRefreshWebpackPlugin({
      overlay: false, // NOTE 是否以遮挡的形式展示错误
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
    pathinfo: false,
    clean: true,
  },
  watchOptions: {
    aggregateTimeout: 600, // 在第一个文件更改后，添加一个延迟再进行重新构建。这样可以让webpack在此期间聚合其他任何更改，并进行一次重新构建。单位：ms
    poll: 100, // 轮询时长 单位：ms
    ignored: ['**/node_modules'],
    stdin: true,
    followSymlinks: false, // 在查找文件时，跟随符号链接。This is usually not needed as webpack already resolves symlinks with `resolve.symlinks`.
  },
  experiments: {
    lazyCompilation: true,
  },
}
const config = merge(base, dev)

module.exports = config
