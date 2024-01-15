const path = require('path')
const os = require('os')
const { dev, getHtmWebpackPlugin } = require('@liutsing/webpack-config')
const { merge } = require('webpack-merge')
const FontMinifyPlugin = require('@liutsing/font-minify-plugin')
const webpack = require('webpack')
const MapleHtmlWebpackPlugin = require('@liutsing/html-webpack-plugin')

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

const root = process.cwd()
const mode = process.env.NODE_ENV
const isDev = mode === 'development'
const smp = new SpeedMeasurePlugin()
const cssLoaders = [
  isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
  {
    loader: 'css-loader',
    options: {
      modules: {
        localIdentName: isDev ? '[name]__[local]' : '[hash:base64]',
        mode: 'local',
        auto: true,
        exportGlobals: true,
        localIdentContext: path.resolve(__dirname, 'src'),
      },
    },
  },
  'postcss-loader',
]

// console.log(require('os').cpus().length) 24

const config = merge(
  {},
  {
    entry: path.resolve(__dirname, '../src/main.tsx'),
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /(node_modules)/,
          use: [
            {
              loader: 'thread-loader',
              options: {
                workers: require('os').cpus().length,
              },
            },
            {
              // `.swcrc` can be used to configure swc
              loader: 'swc-loader',
            },
          ],
        },
        {
          test: /\.css$/,
          use: cssLoaders,
        },
        {
          test: /\.less$/,
          use: [...cssLoaders, 'less-loader'],
        },
        {
          test: /\.svg$/,
          exclude: /node_modules/,
          use: ['@svgr/webpack', 'svgo-loader'],
        },
      ],
    },
    plugins: [
      getHtmWebpackPlugin(false),
      // new webpack.DllReferencePlugin({
      //   context: process.cwd(),
      //   manifest: require(path.join(__dirname, '../public', 'vendor-manifest.json')),
      // }),
      // new MapleHtmlWebpackPlugin([{ tagName: 'script', src: 'vendor.bundle.js', defer: true }], 'head'),
      // new FontMinifyPlugin({
      //   words: path.resolve(os.tmpdir(), 'example-webpack-react.txt'),
      //   fontSource: path.resolve(__dirname, '../../../packages/font-minify-plugin/puhui2/AlibabaPuHuiTi_2_65_Medium.ttf'),
      //   fontDistFilename: 'AlibabaPuHuiTi_2_65_Medium',
      // }),
      new FontMinifyPlugin({
        words: '魑魅魍魉',
        isFilePath: false,
      }),
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
    resolve: {
      // 尽可能少
      extensions: ['.js', '.ts', '.tsx', '.css', '.less'], // extensions: ['.js', '.ts', '.tsx', '.jsx', '.node', '.wasm', '.css', '.less', '.scss', '.styl'],
      alias: {
        '@': path.resolve(root, './src'),
      },
      mainFiles: ['index'],
      cacheWithContext: false,
    },
  }
)
// FIXME speed-measure-webpack-plugin与@liutsing/html-webpack-plugin不兼容
module.exports = smp.wrap(config)

// module.exports = config
