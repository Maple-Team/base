const path = require('path')
const fs = require('fs')
const child = require('child_process')
const { merge } = require('webpack-merge')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const dayjs = require('dayjs')
const MapleHtmlWebpackPlugin = require('@liutsing/html-webpack-inject-plugin').default
const ESLintPlugin = require('eslint-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyPlugin = require('copy-webpack-plugin')

const { minfiyCode } = require('../utils')
const base = require('./webpack.base')

const appRoot = process.cwd()
const root = path.resolve(__dirname, '..')

// 获取app版本信息
let currentGitBranch = 'N/A'
let hash = 'N/A'
try {
  // 只在生产环境下输出
  currentGitBranch = child.execSync('git rev-parse --abbrev-ref HEAD').toString().trim()
  hash = child.execSync('git rev-parse HEAD').toString().trim().substring(0, 8)
} catch (error) {}

// 注入app版本信息
const colorSourceCode = fs.readFileSync(path.resolve(root, './inject/color.js')).toString()
const colorFn = minfiyCode(colorSourceCode)
const { version: appVersion } = require(path.resolve(appRoot, 'package.json'))

/**
 * @type {import("webpack").Configuration}
 */
const prod = {
  mode: 'production',
  devtool: 'hidden-source-map',
  performance: {
    hints: 'warning',
  },
  output: {
    path: path.resolve(appRoot, './dist'),
    filename: '[name].[contenthash].js',
    chunkFilename: 'chunk-[name].[contenthash].js',
    publicPath: '/',
    clean: true,
    pathinfo: false,
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        configFile: path.resolve(appRoot, 'tsconfig.build.json'),
      },
    }),
    new ESLintPlugin({
      cache: true,
      cacheLocation: path.resolve(appRoot, './node_modules/.cache/.eslintcache'),
      extensions: ['js', 'jsx', 'ts', 'tsx'],
      exclude: ['node_modules'],
      failOnError: false,
      failOnWarning: false,
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].chunk.css',
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(appRoot, './public'),
          to: './',
        },
      ],
    }),
    new MapleHtmlWebpackPlugin(
      [
        {
          tagName: 'script',
          content: `;(function () {
        // for version compare
        window.appHash = '${hash}';
        window.appBranch = '${currentGitBranch}';
        const _c = (${colorFn})()
        _c({
          title: 'Build Date',
          content: '${dayjs().format('YYYY-MM-DD HH:mm:ss')}',
        })
        _c({
          title: 'Build Version',
          content: '${appVersion}',
        })
        _c({
          title: 'Build Commit',
          content: '${hash}',
        })
        _c({
          title: 'Build Branch',
          content: '${currentGitBranch}',
        })
      })()`,
        },
        {
          content: minfiyCode(fs.readFileSync(path.resolve(root, './inject/error.js')).toString()),
          tagName: 'script',
        },
      ],
      'body'
    ),
  ],
  optimization: {
    runtimeChunk: true,
    minimize: true,
    minimizer: [
      '...',
      new TerserPlugin({
        parallel: true,
        extractComments: false,
        minify: TerserPlugin.swcMinify,
        terserOptions: {
          compress: true,
          format: {
            comments: false,
          },
        },
      }),
      new CssMinimizerPlugin({ parallel: true }),
      // TODO add esbuild-loader
    ],
    splitChunks: {
      // TODO
      chunks: 'all',
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
}
const config = merge(base, prod)

module.exports = config
