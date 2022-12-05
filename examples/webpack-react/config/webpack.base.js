const path = require('path')
const { ProvidePlugin, DefinePlugin } = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
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
  externals: {
    // @https://www.webpackjs.com/configuration/externals/#externalstype
    react: 'React',
    'react-dom': 'ReactDOM',
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(__dirname, '../public/index.html'),
      title: 'webpack config demo',
      // TODO 模板有分环境
    }),
    new ProvidePlugin({
      React: 'react',
      process: 'process/browser',
    }),
    new DefinePlugin({
      // ...envKeys,
    }),
  ],
}

module.exports = config
