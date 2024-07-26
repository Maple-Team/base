const path = require('path')
const { mergeWithRules } = require('webpack-merge')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const base = require('./webpack.base')

const appRoot = process.cwd()

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
    //  true: 写入本地文件，方便开发下查看输出的产物，方便调试一些babel插件
    writeToDisk: false,
  },
  // 适用于开发环境
  static: {
    // https://webpack.js.org/configuration/dev-server/#devserverstatic
    directory: path.resolve(appRoot, 'public'),
  },
  proxy: [
    {
      context: ['/api'],
      target: process.env.API_URL,
      secure: false,
      changeOrigin: true, // 很重要
    },
    {
      context: ['/ws-service'], // 避免与内置的/ws请求冲突
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
    logging: 'log', // web-dev-server的日志输出控制，输出到控制台: 确定当前的一些配置信息
    overlay: false, // 输出信息是否遮挡页面
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
      overlay: false, // 是否以遮挡的形式展示错误
      library: 'reactRefreshWebpackPlugin',
    }),
  ],
  optimization: {
    moduleIds: 'named', // 便于识别
    chunkIds: 'named', // 便于识别
    concatenateModules: false, // 避免模块被合并
    removeAvailableModules: false, // 保留模块的依赖关系，有助于调试
    removeEmptyChunks: true,
    splitChunks: {
      chunks: 'async', // 不需要复杂的代码切割
    },
    runtimeChunk: false, // 影响代码的加载，比如模块联邦下、HMR
    noEmitOnErrors: true, // 遇到错误不会产生输出文件
    mangleExports: false, // 避免导出的名称被混淆
  },
  devServer,
  // Webpack 基础设施级别的日志记录
  infrastructureLogging: {
    debug: false, // 开启特定日志比如插件(plugins)和加载器(loaders)的调试信息, 提供筛选能力 ['MyPlugin', /MyPlugin/, (name) => name.contains('MyPlugin')],
  },
  output: {
    pathinfo: true,
    clean: true,
    path: path.resolve(appRoot, './dist'),
    filename: '[name].[chunkhash:8].js',
    chunkFilename: '[name].[chunkhash:8].chunk.js',
  },
  watchOptions: {
    // 忽略字体文件的变化
    ignored: /\.woff2?/,
  },
  experiments: {
    lazyCompilation: true,
  },
  profile: false,
  // 产物分析用，含依赖关系等 如果你使用了代码分离(code splittnig)这样的复杂配置，records 会特别有用。这些数据用于确保拆分 bundle，以便实现你需要的缓存(caching)行为。
  recordsPath: path.join(appRoot, './config/records.dev.json'),
}

const config = mergeWithRules({
  output: 'merge',
  infrastructureLogging: 'merge',
  experiments: 'merge',
  watchOptions: 'merge',
})(base, dev)

module.exports = config
