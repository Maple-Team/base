import type { OptionalPick } from '@liutsing/types-utils'
import type { Compiler, WebpackPluginInstance } from 'webpack'
// eslint-disable-next-line import/no-named-default
import type { default as HtmlWebpackPluginInstance } from 'html-webpack-plugin'

type LinkAttribute = OptionalPick<HTMLLinkElement, 'rel' | 'href'>
type ScriptAttribute = OptionalPick<HTMLScriptElement, 'src' | 'defer' | 'async'>

export type Options = {
  content?: string
  tagName: 'script' | 'link' | 'style'
} & LinkAttribute &
  ScriptAttribute

export default class MapleHtmlWebpackPlugin implements WebpackPluginInstance {
  /**
   * @type {Options}
   */
  private options
  private position
  constructor(options: Options | Options[], position?: 'head' | 'body') {
    this.options = options
    this.position = position || 'body'
  }

  /**
   * Extract HTMLWebpack Plugin by jahed
   * @reference: @principalstudio/html-webpack-inject-preload
   *
   * @param compiler
   */
  private extractHtmlWebpackPluginModule = (compiler: Compiler): typeof HtmlWebpackPluginInstance | null => {
    const htmlWebpackPlugin = (compiler.options.plugins || []).find((plugin) => {
      return plugin?.constructor.name === 'HtmlWebpackPlugin'
    }) as typeof HtmlWebpackPluginInstance | undefined
    if (!htmlWebpackPlugin) return null

    const HtmlWebpackPlugin = htmlWebpackPlugin.constructor
    if (!HtmlWebpackPlugin || !('getHooks' in HtmlWebpackPlugin)) return null

    return HtmlWebpackPlugin as typeof HtmlWebpackPluginInstance
  }

  apply(compiler: Compiler) {
    const className = this.constructor.name
    const logger = compiler.getInfrastructureLogger(className)
    compiler.hooks.compilation.tap(className, (compilation) => {
      const HtmlWebpackPlugin = this.extractHtmlWebpackPluginModule(compiler)
      if (!HtmlWebpackPlugin)
        throw new Error('@liutsing/html-webpack-inject-plugin needs to be used with html-webpack-plugin 4 or 5')
      const hooks = HtmlWebpackPlugin.getHooks(compilation)
      hooks.alterAssetTagGroups.tapAsync(className, (data, cb) => {
        try {
          logger.info('@liutsing/html-webpack-plugin running...')
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
        } catch (error) {
          cb(error as Error)
        }
      })
    })
  }
}
