const path = require('path')

/**
 * @type {import('webpack').Configuration}
 */
const config = {
  mode: 'development',
  entry: path.resolve(__dirname, '../src/lib.js'),
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'webpack-numbers.js',
    library: {
      name: 'webpackNumbers',
      type: 'umd',
    },
    clean: true,
  },
  externals: {
    lodash: {
      commonjs: 'lodash',
      commonjs2: 'lodash',
      amd: 'lodash',
      root: '_',
    },
  },
}

module.exports = config
