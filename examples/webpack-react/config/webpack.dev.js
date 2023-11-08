const path = require('path')
const os = require('os')
const { dev, getHtmWebpackPlugin } = require('@liutsing/webpack-config')
const { merge } = require('webpack-merge')
const FontMinifyPlugin = require('@liutsing/font-minify-plugin')
const webpack = require('webpack')
const MapleHtmlWebpackPlugin = require('@liutsing/html-webpack-plugin')
const DashboardPlugin = require('webpack-dashboard/plugin')

// const LifeCycleWebpackPlugin = require('@liutsing/lifecycle-webpack-plugin')
// const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
// new LifeCycleWebpackPlugin({
//   compile: () => {
//     console.log('\n compile \n', new Date())
//   },
//   done: () => {
//     console.log('\n done \n', new Date())
//   },
// }),
// const smp = new SpeedMeasurePlugin()

const config = merge(dev, {
  entry: [path.resolve(__dirname, '../src/main.tsx'), path.resolve(__dirname, '../src/test/index.js')],
  plugins: [
    getHtmWebpackPlugin(false),
    new webpack.DllReferencePlugin({
      context: process.cwd(),
      manifest: require(path.join(__dirname, '../public', 'vendor-manifest.json')),
    }),
    new MapleHtmlWebpackPlugin([{ tagName: 'script', src: 'vendor.bundle.js', defer: true }], 'head'),
    new FontMinifyPlugin({
      words: path.resolve(os.tmpdir(), 'example-webpack-react.txt'),
      fontSource: path.resolve(__dirname, '../../../packages/font-minify-plugin/puhui2/AlibabaPuHuiTi_2_65_Medium.ttf'),
      fontDistFilename: 'AlibabaPuHuiTi_2_65_Medium',
    }),
    new FontMinifyPlugin({
      words: '魑魅魍魉',
      isFilePath: false,
    }),
    new DashboardPlugin(),
  ],
  devtool: false,
  optimization: {
    usedExports: true, // 使用分析报告
    splitChunks: {
      chunks: 'all',
    },
  },
  experiments: {
    lazyCompilation: false,
  },
  // parallelism: 3000,
  externalsType: 'script',
  externals: {
    lodash: ['https://cdn.jsdelivr.net/npm/lodash@4.17.19/lodash.min.js', '_'],
    // FIXME not working 顺序问题
    // react: ['https://static.etlink.ecar.com/js/react_18.2.0_umd_react.development.js', 'React'],
    // 'react-dom/client': ['https://static.etlink.ecar.com/js/react-dom_18.2.0_umd_react-dom.development.js', 'ReactDom'],
  },
  externalsPresets: {
    web: true,
  },
  recordsPath: path.join(__dirname, 'records.json'), // FIXME not working for dev ?
})
// FIXME speed-measure-webpack-plugin与@liutsing/html-webpack-plugin不兼容
// module.exports = smp.wrap(config)

module.exports = config
