const { readFileSync } = require('fs')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const dirname = path.dirname(__dirname)
const templatePath = path.join(dirname, './utils/template.html')

const templateContent = readFileSync(templatePath).toString()
const { meta } = require('./meta')

// 从这个项目中学习一些设定项目 /Users/liutsing/Code/incubator-answer
/**
 * 获取HtmlWebpackPlugin实例
 * TODO 传入参数
 * TODO LOADING 主题变量
 * @returns
 */
const getHtmWebpackPlugin = (hash = true) =>
  new HtmlWebpackPlugin({
    inject: true,
    hash,
    cache: false,
    templateContent: () => templateContent,
    meta,
  })

module.exports = { getHtmWebpackPlugin, meta, templateContent }
