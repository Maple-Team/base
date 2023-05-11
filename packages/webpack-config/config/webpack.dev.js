const { merge } = require('webpack-merge')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const base = require('./webpack.base')

/**
 * @type {import("webpack-dev-server").Configuration}
 */
const devServer = {
  headers: { 'X-Upstream': process.env.API_URL },
  compress: false,
  port: process.env.PORT,
  // host: '',
  hot: true,
  open: false,
  setupExitSignals: true,
  historyApiFallback: true,
  proxy: {
    '/api': {
      target: process.env.API_URL,
      // pathRewrite: { '^/api': '' },
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
  cache: true,
  plugins: [new ReactRefreshWebpackPlugin()],
  optimization: {
    removeAvailableModules: true,
    removeEmptyChunks: true,
    splitChunks: false,
    runtimeChunk: true,
  },
  resolveLoader: {
    alias: {
      // 'maple-pattern-loader': path.resolve(__dirname, '../plugins/maple-pattern-loader.js'),
    },
  },
  devServer,
  infrastructureLogging: {
    appendOnly: true,
    level: 'verbose',
    debug: true,
  },
  experiments: {
    lazyCompilation: true,
  },
}
const config = merge(base, dev)

module.exports = config
