const path = require('path')
const { ProvidePlugin, DefinePlugin } = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MapleHtmlWebpackPlugin = require('@liutsing/html-webpack-plugin')
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin')
const CopyPlugin = require('copy-webpack-plugin')

const root = process.cwd()
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
    cacheWithContext: false,
  },
  target: 'web',
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        exclude: /node_modules/,
        include: [path.resolve(root, './src')],
        use: ['babel-loader'],
        sideEffects: true,
      },
      {
        test: /\.(j|t)sx?$/,
        exclude: /node_modules/,
        include: [path.resolve(root, './src/assets/svg-icons')],
        use: ['babel-loader'],
        sideEffects: true,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
        sideEffects: true,
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader'],
        sideEffects: true,
      },
      {
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
    new MapleHtmlWebpackPlugin({ tagName: 'link', rel: 'stylesheet', href: './fonts/index.css' }, 'body'),
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
  ],
}

module.exports = config
