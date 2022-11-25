const path = require('path')

/**
 * @type {import('webpack').Configuration}
 */
const config = {
  entry: path.resolve(__dirname, '../src/main.tsx'),
  output: { filename: 'main.js', path: path.resolve(__dirname, '../dist') },
  // NOTE @antv/g2 按需加载
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
  plugins: [],
  target: 'web',
  externals: {
    //@https://www.webpackjs.com/configuration/externals/#externalstype
    react: 'React',
    'react-dom': 'ReactDOM',
  },
}

module.exports = config
