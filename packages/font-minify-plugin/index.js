const os = require('os')
const path = require('path')
const fs = require('fs')
const { validate } = require('schema-utils')
const { generatePuhui } = require('./fontmin')

const schema = {
  type: 'object',
  properties: {
    test: {
      type: 'string',
      // 字体地址/待简化的字体/字体写入路径
    },
  },
}

const name = ''

class FontMinifyPlugin {
  constructor(options = {}) {
    validate(schema, options, {
      name: 'Hello World Plugin',
      baseDataPath: 'options',
    })
  }

  /**
   *
   * @param {import('webpack').Compiler} compiler
   * @returns
   */
  apply(compiler) {
    const className = this.constructor.name
    const mode = compiler.options.mode
    const logger = compiler.getInfrastructureLogger(className)
    compiler.hooks.initialize.tap(className, () => {
      logger.info(`initialize...`)
      // 重新执行webpack时，将之前的文件删除，避免因版本变更导致字体文件越来越大
      const loaderTextPath = path.resolve(os.tmpdir(), `chinese-extract-loader-${name}.txt`)
      if (fs.existsSync(loaderTextPath)) {
        logger.info(`删除之前存在的汉字资源文件`)
        fs.unlinkSync(loaderTextPath)
      }
    })

    compiler.hooks.thisCompilation.tap(className, (compilation) => {
      compilation.hooks.additionalAssets.tapPromise(className, () => {
        return generatePuhui(mode).then((fonts) => {
          console.log(`添加字体资源, 字体数:`, fonts.length)
          Array.prototype.concat.apply([], fonts).forEach((font) => {
            compilation.assets[font.filename] = {
              source: () => font.content,
              size: () => font.size,
            }
          })
        })
      })
    })
  }
}

module.exports = FontMinifyPlugin
