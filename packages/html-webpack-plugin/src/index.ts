import HtmlWebpackPlugin from 'html-webpack-plugin'
import * as webpack from 'webpack'

type LinkAttribute = Pick<HTMLLinkElement, 'rel' | 'href'>
type ScriptAttribute = Pick<HTMLScriptElement, 'src'>

// TODO 支持更多注入的
export type Options = {
  content?: string
  tagName: 'script' | 'link'
} & LinkAttribute &
  ScriptAttribute
export default class MapleHtmlWebpackPlugin {
  /**
   * @type {Options}
   */
  private options
  private position
  constructor(options: Options | Options[], position?: 'header' | 'body') {
    this.options = options
    this.position = position || 'body'
  }

  apply(compiler: webpack.Compiler) {
    return compiler.hooks.compilation.tap('MapleHtmlWebpackPlugin', (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups.tapAsync('MapleHtmlWebpackPlugin', (data, cb) => {
        if (this.options) {
          if (!Array.isArray(this.options)) {
            this.options = [this.options]
          }
          const tags = this.options.map(({ tagName, src, content, rel, href }) => {
            return tagName === 'script'
              ? {
                  tagName,
                  voidTag: false,
                  attributes: {
                    src,
                  },
                  innerHTML: content,
                  meta: {},
                }
              : {
                  tagName,
                  voidTag: true,
                  attributes: {
                    rel,
                    href,
                  },
                  meta: {},
                }
          })
          if (this.position === 'header') {
            data.headTags.push(...tags)
          } else {
            data.bodyTags.push(...tags)
          }
        }
        cb(null, data)
      })
    })
  }
}
