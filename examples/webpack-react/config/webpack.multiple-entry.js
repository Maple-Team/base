const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

module.exports = {
  mode: process.env.NODE_ENV,
  entry: {
    home: [path.resolve(__dirname, '../entry/home.js'), path.resolve(__dirname, '../entry/home.less')],
    account: [path.resolve(__dirname, '../entry/account.js'), path.resolve(__dirname, '../entry/account.less')],
  },
  output: {
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          // fallback to style-loader in development
          process.env.NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader',
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new HtmlWebpackPlugin({
      filename: (entryName) => entryName + '.html', // <- // TODO test
    }),
  ],
}
