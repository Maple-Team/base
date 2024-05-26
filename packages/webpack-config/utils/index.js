const { readFileSync } = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const templateContent = readFileSync('./template.html').toString()
const { meta } = require('./meta')

// 从这个项目中学习一些设定项目 /Users/liutsing/Code/incubator-answer
/**
 * 获取HtmlWebpackPlugin实例
 * TODO 传入参数
 * @returns
 */
const getHtmWebpackPlugin = (hash = true) =>
  new HtmlWebpackPlugin({
    inject: true,
    hash, // 文件连接hash值
    cache: false,
    // TODO LOADING 主题变量
    templateContent: () => templateContent,
    meta,
  })

module.exports = { getHtmWebpackPlugin, meta, templateContent }
