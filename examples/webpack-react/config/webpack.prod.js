const path = require('path')
const os = require('os')
const { prod, getHtmWebpackPlugin } = require('@liutsing/webpack-config')
const FontMinifyPlugin = require('@liutsing/font-minify-plugin')
const { merge } = require('webpack-merge')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

module.exports = merge(prod, {
  // entry: path.resolve(__dirname, '../src/test/index.js'),
  entry: path.resolve(__dirname, '../src/main.tsx'),
  plugins: [
    getHtmWebpackPlugin(false),
    // new FontMinifyPlugin({
    //   words: path.resolve(os.tmpdir(), 'example-webpack-react.txt'),
    // }),
    // new ForkTsCheckerWebpackPlugin({
    //   typescript: {
    //     configFile: 'tsconfig.build.json',
    //     context: process.cwd(),
    //   },
    // }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
})
