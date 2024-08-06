const path = require('path')
const { dev } = require('@liutsing/webpack-config')
const { merge } = require('webpack-merge')

/**
 *
 * @type {import("webpack").Configuration}
 */
const config = merge(dev, {
  // 合并
  experiments: {
    lazyCompilation: false, // NOTE 按需编译/延迟编译，但还未稳定
  },
  stats: 'none',
  profile: false,
  devServer: {
    devMiddleware: {
      //  true: 写入本地文件，方便开发下查看输出的产物，方便调试一些babel插件
      writeToDisk: true,
    },
  },
})

module.exports = config
