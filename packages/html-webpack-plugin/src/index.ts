import HtmlWebpackPlugin from 'html-webpack-plugin'
import * as webpack from 'webpack'

// TODO 支持更多注入的
export interface Options {
  src: string
  tagName: 'script'
}
export default class MapleHtmlWebpackPlugin {
  /**
   * @type {Options}
   */
  private options
  // TODO 类型处理
  constructor(options?: Options) {
    this.options = options
  }

  apply(compiler: webpack.Compiler) {
    return compiler.hooks.compilation.tap('MapleHtmlWebpackPlugin', (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups.tapAsync('MapleHtmlWebpackPlugin', (data, cb) => {
        console.log('data', data)
        if (this.options) {
          const { src, tagName } = this.options
          data.headTags.unshift({
            tagName,
            voidTag: false,
            attributes: {
              src,
              type: 'application/javascript',
            },
            meta: {},
          })
        }
        cb(null, data)
      })
    })
  }
}
