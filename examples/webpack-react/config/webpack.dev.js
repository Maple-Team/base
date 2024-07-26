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

const config = merge(dev, {
  entry: path.resolve(__dirname, '../src/main.tsx'),
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
  experiments: {
    lazyCompilation: true,
  },
  // parallelism: 10, // 平行处理的模块数量，需要微调达到最佳性能(还不知如何微调)
  // recordsPath: path.join(__dirname, 'records.json'), // 产物分析用，含依赖关系等
  output: {
    ...dev.output,
    clean: true,
  },
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
    devMiddleware: {
      // true: 写入本地文件，方便开发下查看输出的产物，方便调试一些babel插件
      writeToDisk: false,
    },
  },

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
// NOTE 如果要使用本地的HtmlWebpackPlugin配置的话
// const useLocalHtmlWebpackPlugin = process.env.USE_LOCAL_HTML_WEBPACK_PLUGIN === 'true' || false
// if (useLocalHtmlWebpackPlugin) {
//   const htmlPluginIndex = dev.plugins.findIndex((plugin) => plugin instanceof HtmlWebpackPlugin)
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
