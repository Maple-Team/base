import HtmlWebpackPlugin from 'html-webpack-plugin'
import type * as webpack from 'webpack'
import type { OptionalPick } from '@liutsing/types-utils'

type LinkAttribute = OptionalPick<HTMLLinkElement, 'rel' | 'href'>
type ScriptAttribute = OptionalPick<HTMLScriptElement, 'src' | 'defer' | 'async'>

export type Options = {
  content?: string
  tagName: 'script' | 'link' | 'style'
} & LinkAttribute &
  ScriptAttribute

export default class MapleHtmlWebpackPlugin {
  /**
   * @type {Options}
   */
  private options
  private position
  constructor(options: Options | Options[], position?: 'head' | 'body') {
    this.options = options
    this.position = position || 'body'
  }

  apply(compiler: webpack.Compiler) {
    const className = this.constructor.name
    const logger = compiler.getInfrastructureLogger(className)
    return compiler.hooks.compilation.tap(className, (compilation) => {
      const hooks = HtmlWebpackPlugin.getHooks(compilation)
      if (!hooks) throw new Error('HtmlWebpackPlugin hooks are not available.')
      hooks.alterAssetTagGroups.tapAsync(className, (data, cb) => {
        logger.info('HtmlWebpackPlugin自定义插件执行...')
        if (this.options) {
          if (!Array.isArray(this.options)) this.options = [this.options]
          // 避免空数组为空
          if (this.options.filter(Boolean).length === 0) return cb(null, data)
          const tags = this.options.filter(Boolean).map(({ tagName, src, content, rel, href, ...rest }) => {
            return tagName === 'script'
              ? {
                  tagName,
                  voidTag: false,
                  attributes: {
                    src,
                    ...rest,
                  },
                  innerHTML: content,
                  meta: {},
                }
              : tagName === 'style'
              ? {
                  tagName,
                  voidTag: false,
                  attributes: {
                    ...rest,
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
          if (this.position === 'head') {
            const scriptIndex = data.headTags.findIndex((i) => i.tagName === 'script')
            data.headTags.splice(scriptIndex, 0, ...tags)
          } else {
            data.bodyTags.unshift(...tags)
          }
        }
        cb(null, data)
      })
    })
  }
}
