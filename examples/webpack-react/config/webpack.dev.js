const path = require('path')
const os = require('os')
const { dev, meta, templateContent } = require('@liutsing/webpack-config')
const { merge } = require('webpack-merge')
const FontMinifyPlugin = require('@liutsing/font-minify-plugin')
const MapleHtmlWebpackPlugin = require('@liutsing/html-webpack-inject-plugin').default
const HtmlWebpackPlugin = require('html-webpack-plugin')
const DashboardPlugin = require('webpack-dashboard/plugin')

// const HtmlWebpackInjectPreload = require('@principalstudio/html-webpack-inject-preload')

// const LifeCycleWebpackPlugin = require('@liutsing/lifecycle-webpack-plugin')
// new LifeCycleWebpackPlugin({
//   compile: () => {
//     console.log('\n compile \n', new Date())
//   },
//   done: () => {
//     console.log('\n done \n', new Date())
//   },
// }),

// FIXME speed-measure-webpack-plugin与@liutsing/html-webpack-inject-plugin不兼容
// const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
// const smp = new SpeedMeasurePlugin()

// NOTE 如果要使用本地的HtmlWebpackPlugin配置的话
const useLocalHtmlWebpackPlugin = process.env.USE_LOCAL_HTML_WEBPACK_PLUGIN === 'true' || false
if (useLocalHtmlWebpackPlugin) {
  const htmlPluginIndex = dev.plugins.findIndex((plugin) => plugin instanceof HtmlWebpackPlugin)
  dev.plugins.splice(htmlPluginIndex >>> 0, 1)
}

const config = merge(dev, {
  entry: path.resolve(__dirname, '../src/main.tsx'),
  plugins: [
    useLocalHtmlWebpackPlugin
      ? new HtmlWebpackPlugin({
          inject: true,
          hash: false,
          cache: false,
          templateContent: () => templateContent,
          meta,
        })
      : null,
    new MapleHtmlWebpackPlugin(
      [
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
        {
          tagName: 'script',
          content: `window.onload = function () {
            console.log('window.onload')
          }`,
        },
      ],
      'body'
    ),
    // new HtmlWebpackInjectPreload({
    //   files: [
    //     {
    //       match: /.*\.woff2$/,
    //       attributes: { as: 'font', type: 'font/woff2', crossorigin: true },
    //     },
    //   ],
    // }),
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
    new FontMinifyPlugin({
      words: '文言文字形对比',
      isFilePath: false,
    }),
    new DashboardPlugin(),
  ].filter(Boolean),
  optimization: {
    usedExports: true, // 使用分析报告
    runtimeChunk: 'single',
    moduleIds: 'deterministic',
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
    proxy: [
      {
        context: ['/api'],
        target: process.env.API_URL,
        secure: false,
        changeOrigin: true, // NOTE 很重要
      },
    ],
  },
  // 持久化缓存
  cache: {
    type: 'filesystem',
    cacheDirectory: path.resolve(__dirname, '../node_modules/.cache/webpack'),
    buildDependencies: {
      // 那些文件发现改变就让缓存失效，一般为 webpack 的配置文件
      config: [__filename],
    },
    managedPaths: [path.resolve(__dirname, '../node_modules')], // 受控目录，指的就是那些目录文件会生成缓存
    // 缓存时间
    maxAge: 1000 * 60 * 60 * 24 * 7,
    compression: false,
    profile: false,
  },
})

// module.exports = smp.wrap(config)
module.exports = config
