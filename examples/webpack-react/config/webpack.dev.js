const path = require('path')
const os = require('os')
const { dev, templateContent, meta } = require('@liutsing/webpack-config')
const { merge } = require('webpack-merge')
const FontMinifyPlugin = require('@liutsing/font-minify-plugin')

const MapleHtmlWebpackPlugin = require('@liutsing/html-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const DashboardPlugin = require('webpack-dashboard/plugin')

// const LifeCycleWebpackPlugin = require('@liutsing/lifecycle-webpack-plugin')
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
// new LifeCycleWebpackPlugin({
//   compile: () => {
//     console.log('\n compile \n', new Date())
//   },
//   done: () => {
//     console.log('\n done \n', new Date())
//   },
// }),
const smp = new SpeedMeasurePlugin()
// TODO ModuleFederationPlugin
const config = merge(dev, {
  entry: path.resolve(__dirname, '../src/main.tsx'),
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      hash: true, // 文件连接hash值
      cache: false,
      // TODO LOADING 主题变量
      templateContent: () => templateContent,
      meta,
    }),

    new MapleHtmlWebpackPlugin(
      [
        // {
        //   tagName: 'style',
        //   content: `
        //   @font-face {
        //     font-family: 'Alibaba PuHuiTi 2.0 55';
        //     src: url('/fonts/AlibabaPuHuiTi_2_55_Regular.woff2') format('woff2'),
        //       url('/fonts/AlibabaPuHuiTi_2_55_Regular.woff') format('woff');
        //     font-weight: normal;
        //     font-style: normal;
        //     font-display: swap;
        //   }
        //   `,
        // },
        // null,
      ],
      'head'
    ),
    // 动态扫描 -> babel缓存了导致这个文字文件不存在
    new FontMinifyPlugin({
      words: path.resolve(os.tmpdir(), 'example-webpack-react.txt'),
      fontSource: path.resolve(
        __dirname,
        '../../../packages/font-minify-plugin/puhui2/AlibabaPuHuiTi_2_55_Regular.ttf'
      ),
      fontDistFilename: 'AlibabaPuHuiTi_2_55_Regular',
    }),
    // 静态传入
    // new FontMinifyPlugin({
    //   words: '文言文字形对比',
    //   isFilePath: false,
    // }),
    new DashboardPlugin(),
  ],
  optimization: {
    usedExports: true, // 使用分析报告
    runtimeChunk: 'single',
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
    lodash: ['https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-y/lodash.js/4.17.21/lodash.min.js', '_'],
  },
  externalsPresets: {
    web: true,
  },
  recordsPath: path.join(__dirname, 'records.json'), // FIXME not working for dev ?
  devServer: {
    ...dev.devServer,
    headers: { 'X-Upstream': process.env.API_URL, 'Access-Control-Allow-Origin': '*' },
    proxy: {
      '/api': {
        target: process.env.API_URL,
        secure: false,
        changeOrigin: true,
      },
    },
  },
})
// FIXME speed-measure-webpack-plugin与@liutsing/html-webpack-plugin不兼容
// module.exports = smp.wrap(config)

module.exports = config
