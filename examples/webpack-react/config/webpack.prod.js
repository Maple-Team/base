const path = require('path')
const os = require('os')
const { prod } = require('@liutsing/webpack-config')
const FontMinifyPlugin = require('@liutsing/font-minify-plugin')
const { merge } = require('webpack-merge')

module.exports = merge(prod, {
  entry: path.resolve(__dirname, '../src/test/index.js'),
  plugins: [
    // new FontMinifyPlugin({
    //   words: path.resolve(os.tmpdir(), 'example-webpack-react.txt'),
    // }),
  ],
  recordsPath: path.join(__dirname, 'records.json'),

})
