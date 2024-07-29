const path = require('path')
const os = require('os')
const { dev } = require('@liutsing/webpack-config')
const { merge } = require('webpack-merge')
const FontMinifyPlugin = require('@liutsing/font-minify-plugin')
const threadLoader = require('thread-loader')
const { writeFile } = require('fs')

threadLoader.warmup(
  {
    workers: require('os').cpus().length,
    poolTimeout: Infinity,
  },
  [
    'babel-loader',
    'less-loader',
    'style-loader',
    'css-loader',
    'postcss-loader',
    'svgo-loader',
    'css-modules-typescript-loader',
    '@babel/preset-env',
    '@babel/preset-react',
    '@babel/preset-typescript',
  ]
)

/**
 *
 * @type {import("webpack").Configuration}
 */
const config = merge(dev, {
  // 合并
  plugins: [
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
  ].filter(Boolean),
  // 替换
  experiments: {
    lazyCompilation: false, // NOTE 按需编译/延迟编译，但还未稳定
  },
  stats: 'none',
  profile: false,
})

// NOTE 输出配置详情来确认webpack-merge策略是否按预期正常输出，方便定位问题
const configStr = JSON.stringify(config, null, 2)
writeFile(path.resolve(__dirname, './webpack.dev.json'), configStr, (err) => {
  if (err) {
    console.log(err)
  }
})

module.exports = config

// -----------------------------------------------------------------------------
// 如果要使用本地的HtmlWebpackPlugin配置的话
// const useLocalHtmlWebpackPlugin = process.env.USE_LOCAL_HTML_WEBPACK_PLUGIN === 'true' || false
// if (useLocalHtmlWebpackPlugin) {
//   const htmlPluginIndex = dev.plugins.findIndex((plugin) => plugin.constructor.name==='')
//   dev.plugins.splice(htmlPluginIndex >>> 0, 1)
// }
// useLocalHtmlWebpackPlugin
//   ? new HtmlWebpackPlugin({
//       inject: true,
//       hash: false,
//       cache: false,
//       templateContent: () => templateContent,
//       meta,
//     })
//   : null,
// new MapleHtmlWebpackPlugin(
//   [
//     {
//       tagName: 'style',
//       content: `
//       @font-face {
//         font-family: 'Alibaba PuHuiTi 2.0 55';
//         src: url('/fonts/AlibabaPuHuiTi_2_55_Regular.woff2') format('woff2'),
//           url('/fonts/AlibabaPuHuiTi_2_55_Regular.woff') format('woff');
//         font-weight: normal;
//         font-style: normal;
//         font-display: swap;
//       }
//       `,
//     },
//   ],
//   'body'
// ),
// new HtmlWebpackInjectPreload({
//   files: [
//     {
//       match: /.*\.woff2$/,
//       attributes: { as: 'font', type: 'font/woff2', crossorigin: true },
//     },
//   ],
// }),
// {
//     type: 'filesystem',
//     cacheDirectory: path.resolve(__dirname, '../node_modules/.cache/webpack'),
//     buildDependencies: {
//       // 那些文件发现改变就让缓存失效，一般为 webpack 的配置文件
//       config: [__filename],
//     },
//     managedPaths: [path.resolve(__dirname, '../node_modules')], // 受控目录，指的就是那些目录文件会生成缓存
//     // 缓存时间
//     maxAge: 1000 * 60 * 60 * 24 * 7,
//     compression: false,
//     profile: false,
//   }
// externalsType: 'script',
// externals: {
//   lodash: ['https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-y/lodash.js/4.17.21/lodash.min.js', '_'],
// },
// externalsPresets: {
//   web: true,
// },
// new StatsPlugin('./stats.json', {
//   chunkModules: true,
//   exclude: [/node_modules/],
// }),
// 效果不明显
// new webpack.DllReferencePlugin({
//   context: __dirname,
//   manifest: require('../public/library.json'),
//   scope: 'xyz',
//   sourceType: 'commonjs2',
// }),
// parallelism: 10, // 平行处理的模块数量，需要微调达到最佳性能(还不知如何微调)
