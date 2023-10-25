const path = require('path')
const webpack = require('webpack')

module.exports = {
  mode: 'development',
  entry: {
    vendor: [
      'react',
      'react-dom',
      'axios',
      // 'dayjs',
      'react-router-dom',
    ],
  },
  output: {
    filename: 'vendor.bundle.js',
    path: path.join(__dirname, '../public'),
    library: 'vendor_lib',
  },
  plugins: [
    new webpack.DllPlugin({
      name: 'vendor_lib',
      path: path.join(__dirname, '../public', 'vendor-manifest.json'),
    }),
  ],
}
