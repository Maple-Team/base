const path = require('path')
const webpack = require('webpack')

module.exports = {
  mode: 'production',
  name: 'verdor',
  entry: {
    library: ['react', 'react-dom', 'axios', 'lodash-es', 'react-i18next', 'socket.io-client'],
  },
  output: {
    filename: '[name]_[chunkhash].dll.js',
    path: path.resolve(__dirname, '../public'),
    library: '[name]',
  },
  plugins: [
    new webpack.DllPlugin({
      context: __dirname,
      name: '[name]_[hash]',
      path: path.join(__dirname, '../public/[name].json'),
    }),
  ],
}
