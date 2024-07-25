const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { meta } = require('@liutsing/webpack-config')
const { ProvidePlugin, DefinePlugin } = require('webpack')

const root = process.cwd()
const mode = process.env.NODE_ENV
const isDev = mode === 'development'
const envKeys = require('../plugins/env.js')(root)

const cssLoaders = [
  isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
  {
    loader: 'css-loader',
    options: {
      modules: {
        localIdentName: isDev ? '[name]__[local]' : '[hash:base64]',
        mode: 'local',
        auto: true,
        exportGlobals: true,
        localIdentContext: path.resolve(__dirname, 'src'),
      },
    },
  },
  'postcss-loader',
]

const config = {
  mode: 'development',
  entry: path.resolve(__dirname, '../src/main.tsx'),
  module: {
    rules: [
      {
        test: /\.(t|j)sx?$/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: 'thread-loader',
            options: {
              // 工作线程数量，可以根据你的 CPU 核心数调整
              workers: require('os').cpus().length - 1,
            },
          },
          {
            loader: 'swc-loader',
          },
        ],
      },
      {
        test: /\.css$/,
        use: cssLoaders,
      },
      {
        test: /\.less$/,
        use: [...cssLoaders, 'less-loader'],
      },
      {
        test: /\.svg$/,
        exclude: /node_modules/,
        use: ['@svgr/webpack', 'svgo-loader'],
      },
    ],
  },
  devtool: 'eval-cheap-module-source-map',
  optimization: {
    usedExports: true, // 使用分析报告
    splitChunks: {
      chunks: 'all',
    },
  },
  resolve: {
    // 尽可能少
    extensions: ['.js', '.ts', '.tsx', '.css', '.less'], // extensions: ['.js', '.ts', '.tsx', '.jsx', '.node', '.wasm', '.css', '.less', '.scss', '.styl'],
    alias: {
      '@': path.resolve(root, './src'),
    },
    mainFiles: ['index'],
    cacheWithContext: false,
  },
  experiments: {
    lazyCompilation: false,
  },
  target: 'web',
  devServer: {
    headers: { 'X-Upstream': process.env.API_URL, 'Access-Control-Allow-Origin': '*' },
    port: process.env.PORT,
    host: process.env.HOST,
    hot: true,
    liveReload: false,
    open: false,
    setupExitSignals: true,
    historyApiFallback: true,
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
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      hash: true,
      cache: false,
      // templateParameters: {
      //   foo: 'bar',
      //   themeColor: '#FF9500',
      // },
      // templateContent: templateContentFn,
      meta,
      minify: true,
      title: 'React Webpack Template',
      filename: 'index.html',
      template: path.resolve(__dirname, './index.html'),
    }),
    new ProvidePlugin({
      React: 'react',
      process: 'process/browser',
    }),
    new DefinePlugin({
      // NOTE 注入特定的环境变量，而不是全部的，理清node环境与浏览器环境
      ...envKeys,
    }),
  ],
}

module.exports = config
