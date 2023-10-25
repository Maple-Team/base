const path = require('path')
const child = require('child_process')
const { ProvidePlugin, DefinePlugin } = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const dayjs = require('dayjs')
const MapleHtmlWebpackPlugin = require('@liutsing/html-webpack-plugin')

const currentGitBranch = child.execSync('git rev-parse --abbrev-ref HEAD').toString().trim()
const hash = child.execSync('git rev-parse HEAD').toString().trim().substring(0, 8)

// TODO 参考vue-cli/cra/其他开源社区分享

const root = process.cwd()
const mode = process.env.NODE_ENV
const isDev = mode === 'development'
const envKeys = require('../plugins/env.js')(root)

const { version } = require(path.resolve(root, 'package.json'))
/**
 * @type {import('webpack').Configuration}
 */
const config = {
  entry: path.resolve(root, './src/main.tsx'),
  output: {
    path: path.resolve(root, './dist'),
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].js',
    publicPath: '/',
    clean: true,
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.jsx', '.node', '.wasm', '.css', '.less', '.scss', '.styl'],
    alias: {
      '@': path.resolve(root, './src'),
    },
  },
  target: 'web',
  cache: isDev,
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        exclude: /node_modules/,
        include: [path.resolve(root, './src')],
        use: ['babel-loader'],
      },
      {
        test: /\.css$/,
        use: [isDev ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
        sideEffects: true,
      },
      {
        // FIXME module.css
        test: /\.less$/,
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: false,
            },
          },
          'postcss-loader',
          'less-loader',
        ],
        sideEffects: true,
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
      hash: true,
      cache: false,
      templateContent: () => `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <title>webpack example</title> 
      </head>
      <body>
        <!-- // TODO LOADING 主题变量-->
        <div id="app"></div>
      </body> 
    </html>
      `,
      meta: {
        viewport: 'width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no',
        a: {
          'http-Equiv': 'Content-Type',
          content: 'text/html; charset=utf-8',
        },
        b: {
          'http-equiv': 'X-UA-Compatible',
          content: 'IE=edge',
        },
        c: {
          'http-equiv': 'expires',
          content: 'Wed, 26 Feb 1997 08:21:57 GMT',
        },
        d: {
          'http-equiv': 'pragma',
          content: 'no-cache',
        },
        e: {
          'http-equiv': 'Cache-Control',
          content: 'no-store, must-revalidate',
        },
      },
    }),
    new MapleHtmlWebpackPlugin(
      [
        {
          tagName: 'script',
          content: `;(function () {
          window.appHash = '${hash}';
          window.appBranch = '${currentGitBranch}';
          var c = '#41b883',
            f = '#42c02e',
            l = function (t) {
              var e = t.title,
                r = t.content,
                n = t.backgroundColor,
                i = [
                  '%c '.concat(e, ' %c ').concat(r, ' '),
                  'padding: 1px; border-radius: 3px 0 0 3px; color: #fff; background: '.concat('#35495e', ';'),
                  'padding: 1px; border-radius: 0 3px 3px 0; color: #fff; background: '.concat(n, ';'),
                ]
              return (
                function () {
                  var t
                  console && 'function' === typeof console.log && (t = console).log.apply(t, arguments)
                }.apply(void 0, i),
                i
              )
            }

          function p(t) {
            var e = t.title,
              r = t.content
            return l({
              title: e,
              content: r,
              backgroundColor: c,
            })
          }
          p({
            title: 'Build Date',
            content: '${dayjs().format('YYYY-MM-DD HH:mm:ss')}',
          })
          p({
            title: 'Build Version',
            content: '${version}',
          })
          p({
            title: 'Build Commit',
            content: '${hash}',
          })
          p({
            title: 'Build Branch',
            content: '${currentGitBranch}',
          })
        })()`,
        },
        {
          content: `
        window.addEventListener('error', function handleError(e) {
          // prompt user to confirm refresh
          console.debug(e)
          if (/Loading (?:CSS\\s)?chunk \\d+ failed/.test(e.message)) {
            window.location.reload();
          }
        })`,
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
      ...envKeys,
    }),

    !isDev ? new MiniCssExtractPlugin() : null,
  ].filter(Boolean),
}

module.exports = config
