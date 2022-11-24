const path = require('path')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

/**
 * @type {import('webpack').Configuration}
 */
const config = {
  entry: path.resolve(__dirname, '../src/main.tsx'),
  output: { filename: 'main.js', path: path.resolve(__dirname, '../dist') },
  // mode: 'production',
  mode: 'development',
  // NOTE @antv/g2 按需加载
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
  plugins: [
    new BundleAnalyzerPlugin({
      open: false,
      openAnalyzer: false,
    }),
  ],
  target: 'web',
  // optimization: {
  //   usedExports: true,
  // },
}

module.exports = config
