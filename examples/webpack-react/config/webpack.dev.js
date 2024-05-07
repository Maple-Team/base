const path = require('path')
const os = require('os')
const { dev, getHtmWebpackPlugin } = require('@liutsing/webpack-config')
const { merge } = require('webpack-merge')
const FontMinifyPlugin = require('@liutsing/font-minify-plugin')

const MapleHtmlWebpackPlugin = require('@liutsing/html-webpack-plugin')
const DashboardPlugin = require('webpack-dashboard/plugin')
// const { ModuleFederationPlugin } = require('webpack').container
// const ExternalTemplateRemotesPlugin = require('external-remotes-plugin')

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
    getHtmWebpackPlugin(false),

    new MapleHtmlWebpackPlugin(
      [
        // {
        //   tagName: 'script',
        //   src: 'http://localhost:3002/runtime.js',
        // },
        {
          tagName: 'style',
          content: `
          @font-face {
            font-family: 'Alibaba PuHuiTi 2.0 55';
            src: url('/fonts/AlibabaPuHuiTi_2_55_Regular.woff2') format('woff2'),
              url('/fonts/AlibabaPuHuiTi_2_55_Regular.woff') format('woff');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
          }
          `,
        },
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
    // new ModuleFederationPlugin({
    //   name: 'webpack-example-app',
    //   remotes: {
    //     module_federation: 'module_federation@[module_federationUrl]/remoteEntry.js',
    //   },
    //   shared: { react: { singleton: true }, 'react-dom': { singleton: true } },
    // }),
    // new ExternalTemplateRemotesPlugin(),
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
    // FIXME not working 顺序问题
    // react: ['https://static.etlink.ecar.com/js/react_18.2.0_umd_react.development.js', 'React'],
    // 'react-dom/client': ['https://static.etlink.ecar.com/js/react-dom_18.2.0_umd_react-dom.development.js', 'ReactDom'],
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
