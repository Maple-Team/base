const path = require('path')
const os = require('os')
const { prod } = require('@liutsing/webpack-config')
const FontMinifyPlugin = require('@liutsing/font-minify-plugin')
const { mergeWithRules } = require('webpack-merge')
const { writeFile } = require('fs')

const config = mergeWithRules({
  output: 'merge',
  cache: {
    buildDependencies: {
      config: 'replace',
    },
    module: {
      rules: {
        test: 'match',
        use: {
          loader: 'prepend', // loader追加到前面
        },
      },
    },
  },
})(prod, {
  entry: path.resolve(__dirname, '../src/simple-entry.tsx'),
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
  profile: true,
  stats: 'verbose',
  cache: false,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /@babel(?:\/|\\{1,2})runtime/,
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
      // {
      //   test: /\.(t|j)sx?$/,
      //   use: [
      //     {
      //       // NOTE 与thread-loader存在兼容问题
      //       loader: '@liutsing/pattern-logger-loader',
      //       options: {
      //         showGap: true,
      //         showLogger: true,
      //         logFileName: path.resolve(__dirname, './pattern-src.log'),
      //       },
      //     },
      //   ],
      // },
    ],
  },
})

const configStr = JSON.stringify(config, null, 2)
writeFile(path.resolve(__dirname, './webpack.prod.json'), configStr, (err) => {
  if (err) {
    console.log(err)
  }
})

module.exports = config
