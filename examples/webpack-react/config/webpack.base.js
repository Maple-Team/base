const path = require('path')
const { ProvidePlugin, DefinePlugin } = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MapleHtmlWebpackPlugin = require('@liutsing/html-webpack-plugin')
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin')

/**
 * @type {import('webpack').Configuration}
 */
const config = {
  entry: path.resolve(__dirname, '../src/main.tsx'),

  // NOTE @antv/g2 按需加载
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    mainFiles: ['index'],
    alias: {
      '@': path.resolve(__dirname, '../src'),
    },
    cacheWithContext: false,
  },
  target: 'web',
  module: {
    rules: [
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
      template: path.resolve(__dirname, '../public/index.html'),
      title: 'webpack config demo',
    }),
    new MapleHtmlWebpackPlugin(),
    new ProvidePlugin({
      // React: 'react',
      process: 'process/browser',
    }),
    new DefinePlugin({
      // ...envKeys,
    }),
    new SpriteLoaderPlugin({
      plainSprite: true,
    }),
  ],
}

module.exports = config
