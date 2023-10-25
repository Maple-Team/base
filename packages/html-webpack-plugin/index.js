const HtmlWebpackPlugin = require('html-webpack-plugin')

class MapleHtmlWebpackPlugin {
  constructor(options, position) {
    this.options = options
    this.position = position || 'body'
  }

  /**
   *
   * @param {import('webpack').Compiler} compiler
   * @returns
   */
  apply(compiler) {
    const className = this.constructor.name
    const logger = compiler.getInfrastructureLogger(className)
    return compiler.hooks.compilation.tap(className, (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups.tapAsync(className, (data, cb) => {
        logger.info('HtmlWebpackPlugin自定义插件执行...')
        if (this.options) {
          if (!Array.isArray(this.options)) this.options = [this.options]
          const tags = this.options.map(({ tagName, src, content, rel, href, ...rest }) => {
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
module.exports = MapleHtmlWebpackPlugin
