const path = require('path')
const { ProvidePlugin, DefinePlugin } = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { meta, templateContentFn } = require('../utils')

const mode = process.env.NODE_ENV
const isDev = mode === 'development'

const appRoot = process.cwd()

// 数字安全
const poolTimeout = !isDev ? 500 : 2 ** 31 - 1
/**
 * env环境文件注入的环境变量
 */
const envKeys = require('../plugins/env.js')(appRoot)
// 具体应用的信息
const { version: appVersion, name: appName } = require(path.resolve(appRoot, 'package.json'))
// 通用的css loader配置项
const cssLoaders = [
  isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
  {
    loader: 'css-modules-typescript-loader',
    options: {
      mode: process.env.CI ? 'verify' : 'emit',
    },
  },
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
  // 效果
  {
    loader: 'thread-loader',
    options: {
      // https://webpack.js.org/loaders/thread-loader/
      workers: require('os').cpus().length,
      name: 'webpack-tsx',
      poolTimeout,
    },
  },
]
/**
 * @type {import('webpack').Configuration}
 */
const config = {
  entry: path.resolve(appRoot, './src/main.tsx'),
  name: `App-${appName}`,
  resolve: {
    // 尽可能少
    // extensions: ['.js', '.ts', '.tsx', '.jsx', '.node', '.wasm', '.css', '.less', '.scss', '.styl'],
    // '...': 默认拓展名
    extensions: ['.js', '.ts', '.tsx', '.css', '.less', '...'],
    alias: {
      '@': path.resolve(appRoot, './src'),
      // 其他的模块别名
    },
    mainFiles: ['index'],
    cacheWithContext: false,
    // symlinks: isDev,
  },
  target: ['browserslist'],
  stats: 'errors-warnings',
  // TODO ?
  bail: !isDev,
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        include: [path.resolve(appRoot, './src')],
        // src目录下一个配置
        // node_modules下一个配置: sourceType: 'unambiguous'，三方包不确定
        // test: /\.(js|mjs)$/,
        exclude: /@babel(?:\/|\\{1,2})runtime/,
        use: [
          {
            loader: 'thread-loader',
            options: {
              // https://webpack.js.org/loaders/thread-loader/
              workers: require('os').cpus().length,
              name: 'webpack-tsx',
              // 数字安全
              poolTimeout,
            },
          },
          {
            loader: 'babel-loader',
            options: {
              // https://github.com/babel/babel-loader
              // Default false. When set, the given directory will be used to cache the results of the loader. Future webpack builds will attempt to read from the cache to avoid needing to run the potentially expensive Babel recompilation process on each run. If the value is set to true in options ({cacheDirectory: true}), the loader will use the default cache directory in node_modules/.cache/babel-loader or fallback to the default OS temporary file directory if no node_modules folder could be found in any root directory.
              cacheDirectory: true,
              cacheCompression: false,
              //   cacheIdentifier: '', // 缓存标识符：环境+打包工具相关的版本信息
              inputSourceMap: true,
              sourceMaps: true,
              // 查找配置文件
              //   babelrc: false, // 不读取 .babelrc 或 babel.config.js
              //   configFile: false, // 不查找 babel.config.js
              // 代码输出
              compact: true, // 输出格式化良好的代码
              comments: isDev,
            },
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
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      hash: true, // 文件连接hash值
      cache: false,
      // If you pass a plain object, it will be merged with the default values
      // 注入额外的参数
      templateParameters: {
        foo: 'bar',
        themeColor: '#FF9500' || 'rgba(108, 117, 125, 0.75)',
      },
      // templateParameters: (compilation, assets, assetTags, options) => {
      templateContent: templateContentFn,
      meta,
      minify: isDev
        ? undefined
        : {
            removeComments: true,
            collapseWhitespace: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeEmptyAttributes: true,
            removeStyleLinkTypeAttributes: true,
            keepClosingSlash: true,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true,
          },
      title: appName,
      filename: 'index.html',
    }),
    new ProvidePlugin({
      React: 'react',
      process: 'process/browser',
    }),
    new DefinePlugin({
      // 注入特定的环境变量，而不是全部的，理清node环境与浏览器环境
      ...envKeys,
    }),
  ].filter(Boolean),
  cache: {
    type: 'filesystem',
    buildDependencies: {
      // 那些文件发现改变就让缓存失效，一般为 webpack 的配置文件
      config: [__filename],
      //   defaultWebpack: ['webpack/lib/'],
      tsconfig: [path.resolve(appRoot, 'tsconfig.json')],
    },
    compression: false,
    name: appName,
    store: 'pack', // 现阶段支持的存储类型，类似打包结果
    // FIXME hash化 createEnvironmentHash(env.raw)
    version: appVersion,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    profile: false,
    // cacheDirectory: path.resolve(__dirname, '../node_modules/.cache/webpack'),
    // managedPaths: [path.resolve(__dirname, '../node_modules')],
    // 缓存时间
  },
  output: {
    pathinfo: isDev,
    clean: true,
    path: path.resolve(appRoot, './dist'),
    filename: isDev ? 'js/[name].js' : 'js/[name].[chunkhash:8].js',
    chunkFilename: isDev ? 'js/[name].chunk.js' : 'js/[name].[chunkhash:8].chunk.js',
    assetModuleFilename: 'assets/[name].[hash][ext]',
    publicPath: '/',
    // 打包后文件的公共前缀路径
  },
  // 你可以在统计输出里指定你想看到的信息: 展示产物信息
  // stats: 'summary', // 输出 webpack 版本，以及警告数和错误数
  // stats: 'verbose', // 全部输出
  // stats: 'detailed', // 全部输出除了 chunkModules 和 chunkRootModules
  // stats: 'normal', // 标准输出(默认输出)
  profile: true,
  // 产物分析用，含依赖关系等 如果你使用了代码分离(code splittnig)这样的复杂配置，records 会特别有用。这些数据用于确保拆分 bundle，以便实现你需要的缓存(caching)行为。
  recordsPath: path.join(appRoot, './config/records.prod.json'),
  // Webpack 基础设施级别的日志记录
  infrastructureLogging: {
    appendOnly: true, // 将内容追加到现有输出中，而非更新现有输出，这对于展示状态信息来说非常有用
    colors: true, // 为基础设施日志启用带有颜色的输出
    // console: Console, // 为基础设施日志提供自定义方案
    level: 'log', // 开启基础设施日志输出
  },
  performance: false,
}

module.exports = config

// TODO ---------------------------------------------------
// new StylelintPlugin({ files: '**/*.css', cache: true }),
// const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin')
// Prevents users from importing files from outside of src/ (or node_modules/).
// This often causes confusion because we only process files within src/ with babel.
// To fix this, we prevent you from importing files out of src/ -- if you'd like to,
// please link the files into your node_modules/ and let module-resolution kick in.
// Make sure your source files are compiled, as they will not be processed in any way.
// resolve.plugins
// new ModuleScopePlugin(paths.appSrc, [
//     paths.appPackageJson,
//     reactRefreshRuntimeEntry,
//     reactRefreshWebpackPluginRuntimeEntry,
//     babelRuntimeEntry,
//     babelRuntimeEntryHelpers,
//     babelRuntimeRegenerator,
//   ]),
// module: oneOf: []
