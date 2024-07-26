const path = require('path')
const { ProvidePlugin, DefinePlugin } = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { meta, templateContentFn } = require('../utils')

const mode = process.env.NODE_ENV
const isDev = mode === 'development'

const appRoot = process.cwd()

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
    extensions: ['.js', '.ts', '.tsx', '.css', '.less'],
    alias: {
      '@': path.resolve(appRoot, './src'),
      // 其他的模块别名
    },
    mainFiles: ['index'],
    cacheWithContext: false,
  },
  target: 'web',
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        exclude: /node_modules/,
        include: [path.resolve(appRoot, './src')],
        use: [
          {
            loader: 'thread-loader',
            options: {
              workers: require('os').cpus().length,
              // 数字安全
              poolTimeout: 2 ** 31 - 1,
            },
          },
          {
            loader: 'babel-loader',
            options: {
              // https://github.com/babel/babel-loader
              // Default false. When set, the given directory will be used to cache the results of the loader. Future webpack builds will attempt to read from the cache to avoid needing to run the potentially expensive Babel recompilation process on each run. If the value is set to true in options ({cacheDirectory: true}), the loader will use the default cache directory in node_modules/.cache/babel-loader or fallback to the default OS temporary file directory if no node_modules folder could be found in any root directory.
              cacheDirectory: true,
              cacheCompression: false,
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
      // Or if you want full control, pass a function
      // templateParameters: (compilation, assets, assetTags, options) => {
      //   return {
      //     compilation,
      //     webpackConfig: compilation.options,
      //     htmlWebpackPlugin: {
      //       tags: assetTags,
      //       files: assets,
      //       options
      //     },
      //     'foo': 'bar'
      //   };
      // },
      templateContent: templateContentFn,
      meta,
      minify: true,
      title: appName,
      filename: 'index.html',
      //   scriptLoading: 'defer',
      //   publicPath: '/',
      //   base: '',
      //   favicon: '',
      // 过滤chunks
      //   chunks:[]
      // 排除chunks
      //   excludeChunks:[]
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
    },
    compression: false,
    name: appName,
    store: 'pack', // 现阶段支持的存储类型，类似打包结果
    version: appVersion,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    profile: false,
    // cacheDirectory: path.resolve(__dirname, '../node_modules/.cache/webpack'),
    // managedPaths: [path.resolve(__dirname, '../node_modules')],
    // 缓存时间
  },
  output: {
    pathinfo: true,
    clean: true,
    path: path.resolve(appRoot, './dist'),
    filename: '[name].[chunkhash:8].js',
    chunkFilename: '[name].[chunkhash:8].chunk.js',
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
}

module.exports = config

// TODO ---------------------------------------------------
// new StylelintPlugin({ files: '**/*.css', cache: true }),
