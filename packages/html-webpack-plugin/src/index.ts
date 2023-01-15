import HtmlWebpackPlugin from 'html-webpack-plugin'
import * as webpack from 'webpack'

// TODO 支持更多注入的
export interface Options {
  src?: string
  content?: string
  tagName: 'script'
}
export default class MapleHtmlWebpackPlugin {
  /**
   * @type {Options}
   */
  private options
  // TODO 类型处理
  constructor(options?: Options | Options[]) {
    this.options = options
  }

  apply(compiler: webpack.Compiler) {
    return compiler.hooks.compilation.tap('MapleHtmlWebpackPlugin', (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups.tapAsync('MapleHtmlWebpackPlugin', (data, cb) => {
        if (this.options) {
          if (!Array.isArray(this.options)) {
            this.options = [this.options]
          }
          const tags = this.options.map(({ tagName, src, content }) => ({
            tagName,
            voidTag: false,
            attributes: {
              src,
              type: 'application/javascript',
            },
            innerHTML: content,
            meta: {},
          }))

          data.headTags.unshift(...tags)
        }
        cb(null, data)
      })
    })
  }
}
