const path = require('path')
const { ProvidePlugin, DefinePlugin } = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MapleHtmlWebpackPlugin = require('@liutsing/html-webpack-plugin')
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyPlugin = require('copy-webpack-plugin')

// TODO 参考vue-cli/cra/其他开源社区分享

const root = process.cwd()
const mode = process.env.NODE_ENV
const isDev = mode === 'production'
const envKeys = require('../plugins/env.js')(root)

/**
 * @type {import('webpack').Configuration}
 */
const config = {
  entry: path.resolve(root, './src/main.tsx'),
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.jsx', '.node', '.wasm'],
    mainFiles: ['index'],
    alias: {
      '@': path.resolve(root, './src'),
    },
  },
  target: 'web',
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
        // FIXME
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
        // FIXME
        test: /\.svg$/,
        exclude: /node_modules/,
        use: [
          'svg-sprite-loader',
          // 'svgo-loader',  Node.js tool for optimizing SVG files @https://github.com/svg/svgo
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(root, './public/index.html'),
      title: 'webpack config demo',
    }),
    new MapleHtmlWebpackPlugin({ tagName: 'link', rel: 'stylesheet', href: './fonts/index.css' }, 'head'),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(root, './public/fonts'),
          to: 'fonts',
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
    new SpriteLoaderPlugin({
      plainSprite: true,
    }),
    !isDev ? new MiniCssExtractPlugin() : null,
  ].filter(Boolean),
  output: {
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].js',
    publicPath: '/',
    clean: true,
  },
}

module.exports = config
