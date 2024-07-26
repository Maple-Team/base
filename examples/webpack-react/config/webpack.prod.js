const path = require('path')
const os = require('os')
const { prod } = require('@liutsing/webpack-config')
const FontMinifyPlugin = require('@liutsing/font-minify-plugin')
const { merge } = require('webpack-merge')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

const config = merge(prod, {
  entry: path.resolve(__dirname, '../src/main.tsx'),
  output: {
    ...prod.output,
    publicPath: '/app/',
    clean: true,
  },
  plugins: [
    new FontMinifyPlugin({
      // FIXME 移动到node_modules下
      words: path.resolve(os.tmpdir(), 'example-webpack-react.txt'),
    }),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        configFile: 'tsconfig.build.json',
        context: process.cwd(),
      },
    }),
  ],
  optimization: {
    sideEffects: false,
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
  recordsPath: path.join(__dirname, 'records.json'),
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

const configStr = JSON.stringify(config, null, 2)
writeFile(path.resolve(__dirname, './webpack.prod.json'), configStr, (err) => {
  if (err) {
    console.log(err)
  }
})

module.exports = config
