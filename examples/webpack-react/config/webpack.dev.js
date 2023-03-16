const { merge } = require('webpack-merge')
const base = require('./webpack.base')
const path = require('path')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')

/**
 * @type {import("webpack-dev-server").Configuration}
 */
const devServer = {
  compress: false,
  port: 3000,
  // host: '',
  hot: true,
  open: false,
  setupExitSignals: true,
  historyApiFallback: true,
  proxy: {
    // '/api': {
    //   target: process.env.API_URL,
    //   pathRewrite: { '^/api': '' },
    // },
    // '/ws/': {
    //   target: process.env.WS_URL,
    //   ws: true,
    //   secure: false,
    //   changeOrigin: true,
    // },
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
  output: { filename: '[name].js', path: path.resolve(__dirname, '../dist'), pathinfo: false, publicPath: '/' },
  devtool: 'eval-cheap-module-source-map',
  cache: true,
  plugins: [new ReactRefreshWebpackPlugin()],
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        exclude: /node_modules/,
        include: [path.resolve(__dirname, '../src')],
        use: ['babel-loader'],
      },
      {
        test: /\.(j|t)sx?$/,
        exclude: /node_modules/,
        include: [path.resolve(__dirname, '../src/assets/svg-icons')],
        use: ['babel-loader'],
        sideEffects: true,
      },
      // MORE-LOADER
    ],
  },

  optimization: {
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false,
    runtimeChunk: true,
  },
  resolveLoader: {
    alias: {
      'maple-pattern-loader': path.resolve(__dirname, '../plugins/maple-pattern-loader.js'),
    },
  },
  devServer,
  infrastructureLogging: {
    appendOnly: true,
    level: 'verbose',
    debug: true,
  },
  experiments: {
    lazyCompilation: false,
  },
}
const config = merge(base, dev)

module.exports = config
