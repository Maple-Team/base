const path = require('path')
const os = require('os')
const { prod } = require('@liutsing/webpack-config')
const FontMinifyPlugin = require('@liutsing/font-minify-plugin')
const { mergeWithRules } = require('webpack-merge')
const { writeFile } = require('fs')

const appRoot = path.resolve(__dirname, '..')

const config = mergeWithRules({
  output: 'merge',
  optimization: 'merge',
  cache: {
    buildDependencies: {
      config: 'replace',
    },
    module: {
      rules: {
        test: 'match',
        use: 'replace',
      },
    },
  },
})(prod, {
  entry: path.resolve(appRoot, 'src/simple-entry.tsx'),
  output: {
    publicPath: '/',
    clean: true,
  },
  plugins: [
    new FontMinifyPlugin({
      // 移动到node_modules下
      words: path.resolve(os.tmpdir(), 'example-webpack-react.txt'),
    }),
  ],
  recordsPath: path.join(__dirname, 'records.json'),
  // 持久化缓存
  cache: {
    buildDependencies: {
      // 那些文件发现改变就让缓存失效，一般为 webpack 的配置文件
      config: [__filename],
    },
  },
  profile: false,
  performance: {
    hints: 'warning',
    maxEntrypointSize: 240 * 1024,
  },
  // stats: 'verbose',
  // cache: false,
  module: {
    rules: [
      {
        test: /\.(t|j)sx?$/,
        include: [path.resolve(appRoot, 'src')],
        use: [
          // FIXME not working with thread-loader
          // {
          //   loader: '@liutsing/pattern-logger-loader',
          //   options: {
          //     showGap: true,
          //     showLogger: true,
          //     logFileName: path.resolve(appRoot, 'config/pattern-src.log'),
          //   },
          // },
          {
            loader: 'thread-loader',
            options: {
              workers: require('os').cpus().length,
              name: 'webpack-tsx',
              poolTimeout: 500,
            },
          },
          {
            loader: 'babel-loader',
            options: {
              // 部分配置传给@babel/core
              cacheDirectory: true,
              cacheCompression: false,
              //   cacheIdentifier: '', // 缓存标识符：环境+打包工具相关的版本信息
              inputSourceMap: true,
              sourceMaps: true,
              // 查找配置文件
              //   babelrc: false, // 不读取 .babelrc 或 babel.config.js
              //   configFile: false, // 不查找 babel.config.js
              // 代码输出
              compact: true, // 输出格式化良好的代码
              comments: false,
            },
          },
        ],
      },
      {
        test: /\.js$/,
        // exclude: /@babel(?:\/|\\{1,2})runtime/,
        exclude: /node_modules\/(?!(@liutsing\/utils)).*/, // working
        use: [
          {
            loader: 'babel-loader',
          },
          {
            loader: '@liutsing/pattern-logger-loader',
            options: {
              showGap: true,
              showLogger: true,
              logFileName: path.resolve(__dirname, 'pattern-node_modules.log'),
            },
          },
        ],
      },
    ],
  },
  optimization: {
    minimize: false,
  },
})

const configStr = JSON.stringify(config, null, 2)
writeFile(path.resolve(__dirname, './webpack.prod.json'), configStr, (err) => {
  if (err) {
    console.log(err)
  }
})

module.exports = config
