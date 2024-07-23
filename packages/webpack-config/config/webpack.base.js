const path = require('path')
const fs = require('fs')
const child = require('child_process')
const { ProvidePlugin, DefinePlugin } = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const dayjs = require('dayjs')
const MapleHtmlWebpackPlugin = require('@liutsing/html-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
const { minify_sync } = require('terser')

let currentGitBranch = 'N/A'
let hash = 'N/A'
try {
  currentGitBranch = child.execSync('git rev-parse --abbrev-ref HEAD').toString().trim()
  hash = child.execSync('git rev-parse HEAD').toString().trim().substring(0, 8)
} catch (error) {}

// TODO 参考vue-cli/cra/其他开源社区分享
// https://github.com/TypeStrong/fork-ts-checker-webpack-plugin
// https://github.com/webpack-contrib/eslint-webpack-plugin
// https://github.com/seek-oss/css-modules-typescript-loader
const root = process.cwd()
const projectRoot = path.resolve(__dirname, '..')

const mode = process.env.NODE_ENV

const isDev = mode === 'development'

const colorFn = minify_sync(
  {
    'color.js': fs.readFileSync(path.resolve(projectRoot, './utils/color.js')).toString(),
  },
  { compress: true }
).code
/**
 * env环境文件注入的环境变量
 */
const envKeys = require('../plugins/env.js')(root)

const { version } = require(path.resolve(root, 'package.json'))

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
  entry: path.resolve(root, './src/main.tsx'),

  resolve: {
    // 尽可能少
    extensions: ['.js', '.ts', '.tsx', '.css', '.less'], // extensions: ['.js', '.ts', '.tsx', '.jsx', '.node', '.wasm', '.css', '.less', '.scss', '.styl'],
    alias: {
      '@': path.resolve(root, './src'),
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
        include: [path.resolve(root, './src')],
        use: [
          {
            loader: 'thread-loader',
            options: {
              workers: require('os').cpus().length,
            },
          },
          {
            loader: 'babel-loader',
            options: {
              // https://github.com/babel/babel-loader
              // Default false. When set, the given directory will be used to cache the results of the loader. Future webpack builds will attempt to read from the cache to avoid needing to run the potentially expensive Babel recompilation process on each run. If the value is set to true in options ({cacheDirectory: true}), the loader will use the default cache directory in node_modules/.cache/babel-loader or fallback to the default OS temporary file directory if no node_modules folder could be found in any root directory.
              cacheDirectory: true,
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
    new MapleHtmlWebpackPlugin(
      [
        {
          tagName: 'script',
          content: `;(function () {
          window.appHash = '${hash}';   
          window.appBranch = '${currentGitBranch}';
          const print = ${colorFn}
          debugger
          print({
            title: 'Build Date',
            content: '${dayjs().format('YYYY-MM-DD HH:mm:ss')}',
          })
          print({
            title: 'Build Version',
            content: '${version}',
          })
          print({
            title: 'Build Commit',
            content: '${hash}',
          })
          print({
            title: 'Build Branch',
            content: '${currentGitBranch}',
          })
        })()`,
        },
        {
          content: fs.readFileSync(path.resolve(projectRoot, './utils/error.js')).toString(),
          tagName: 'script',
        },
      ],
      'body'
    ),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(root, './public'),
          to: './',
        },
      ],
    }),
    new ProvidePlugin({
      React: 'react',
      process: 'process/browser',
    }),
    new DefinePlugin({
      // NOTE 注入特定的环境变量，而不是全部的，理清node环境与浏览器环境
      ...envKeys,
    }),

    isDev ? new ESLintPlugin() : null,
    !isDev
      ? new MiniCssExtractPlugin({
          filename: '[name].css',
          chunkFilename: '[id].css',
        })
      : null,
  ].filter(Boolean),
}

module.exports = config
