const path = require('path')
const { readFileSync } = require('fs')
const child = require('child_process')
const { merge } = require('webpack-merge')
// const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const dayjs = require('dayjs')
const MapleHtmlWebpackPlugin = require('@liutsing/html-webpack-inject-plugin').default
const ESLintPlugin = require('eslint-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const { EsbuildPlugin } = require('esbuild-loader')

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
const colorSourceCode = readFileSync(path.resolve(root, './inject/color.js')).toString()
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
  plugins: [
    // new ForkTsCheckerWebpackPlugin({
    //   // TODO 更多配置
    //   typescript: {
    //     configFile: path.resolve(appRoot, 'tsconfig.build.json'),
    //     context: appRoot,
    //     memoryLimit: 3048,
    //   },
    // }),
    new ESLintPlugin({
      // TODO 更多配置
      cache: true,
      cacheLocation: path.resolve(appRoot, './node_modules/.cache/.eslintcache'),
      extensions: ['js', 'jsx', 'ts', 'tsx'],
      exclude: ['node_modules'],
      failOnError: false,
      failOnWarning: false,
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[name].[contenthash:8].chunk.css',
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
        const _c = (${colorFn})();
        _c({ title: 'Build Date', content: '${dayjs().format('YYYY-MM-DD HH:mm:ss')}' });
        _c({ title: 'Build Version', content: '${appVersion}' });
        _c({ title: 'Build Commit', content: '${hash}' });
        _c({ title: 'Build Branch', content: '${currentGitBranch}' });
      })()`,
        },
        {
          content: minfiyCode(readFileSync(path.resolve(root, './inject/error.js')).toString()),
          tagName: 'script',
        },
      ],
      'body'
    ),
  ],
  optimization: {
    runtimeChunk: true,
    minimize: true,
    sideEffects: true,
    usedExports: true,
    minimizer: [
      new CssMinimizerPlugin({ parallel: true }),
      // more faster
      new EsbuildPlugin({
        target: 'es2015', // Syntax to transpile to (see options below for possible values)
      }),
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

// cra TerserPlugin options
// new TerserPlugin({
//     terserOptions: {
//       parse: {
//         // We want terser to parse ecma 8 code. However, we don't want it
//         // to apply any minification steps that turns valid ecma 5 code
//         // into invalid ecma 5 code. This is why the 'compress' and 'output'
//         // sections only apply transformations that are ecma 5 safe
//         // https://github.com/facebook/create-react-app/pull/4234
//         ecma: 8,
//       },
//       compress: {
//         ecma: 5,
//         warnings: false,
//         // Disabled because of an issue with Uglify breaking seemingly valid code:
//         // https://github.com/facebook/create-react-app/issues/2376
//         // Pending further investigation:
//         // https://github.com/mishoo/UglifyJS2/issues/2011
//         comparisons: false,
//         // Disabled because of an issue with Terser breaking valid code:
//         // https://github.com/facebook/create-react-app/issues/5250
//         // Pending further investigation:
//         // https://github.com/terser-js/terser/issues/120
//         inline: 2,
//       },
//       mangle: {
//         safari10: true,
//       },
//       // Added for profiling in devtools
//       keep_classnames: isEnvProductionProfile,
//       keep_fnames: isEnvProductionProfile,
//       output: {
//         ecma: 5,
//         comments: false,
//         // Turned on because emoji and regex is not minified properly using default
//         // https://github.com/facebook/create-react-app/issues/2488
//         ascii_only: true,
//       },
//     },
//   }),
// new WebpackManifestPlugin()
//  new webpack.IgnorePlugin() -> 基于产物分析再处理
