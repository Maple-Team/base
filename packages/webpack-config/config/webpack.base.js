const path = require('path')
const child = require('child_process')
const { ProvidePlugin, DefinePlugin } = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const dayjs = require('dayjs')
const MapleHtmlWebpackPlugin = require('@liutsing/html-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')

const currentGitBranch = child.execSync('git rev-parse --abbrev-ref HEAD').toString().trim()
const hash = child.execSync('git rev-parse HEAD').toString().trim().substring(0, 8)

// TODO 参考vue-cli/cra/其他开源社区分享
// https://github.com/TypeStrong/fork-ts-checker-webpack-plugin
// https://github.com/webpack-contrib/eslint-webpack-plugin
// https://github.com/seek-oss/css-modules-typescript-loader
const root = process.cwd()
const mode = process.env.NODE_ENV
const isDev = mode === 'development'
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
              cacheDirectory: true,
              presets: [
                [
                  '@babel/preset-env',
                  {
                    useBuiltIns: 'usage',
                    corejs: '3.26.1',
                  },
                ],
                ['@babel/preset-react', { development: isDev, runtime: 'automatic' }],
                '@babel/preset-typescript',
              ],
              plugins: [
                '@babel/plugin-transform-runtime',
                ['@liutsing/babel-plugin-extract-used-chinese', { filename: 'example-webpack-react.txt' }],
                isDev ? 'react-refresh/babel' : null,
                !isDev
                  ? [
                      '@liutsing/babel-plugin-remove-console',
                      {
                        exclude: ['debug', 'error', 'warn'],
                      },
                    ]
                  : null,
              ].filter(Boolean),
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

    new ESLintPlugin(),
    !isDev ? new MiniCssExtractPlugin() : null,
  ].filter(Boolean),
}

module.exports = config
