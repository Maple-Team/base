const os = require('os')
const path = require('path')
const fs = require('fs')
const { validate } = require('schema-utils')
const { generateFont } = require('./fontmin')

const schema = {
  type: 'object',
  properties: {
    fontSource: {
      description: '原始字体文件地址',
      type: 'string',
    },
    words: {
      description: '待生成简化字体的文字',
      type: 'string',
    },
    isFilePath: {
      description: '传入的简化字体属性是否为文件路径',
      type: 'boolean',
    },
    fontDistDirectory: {
      description: '简化后的字体文件地址目录',
      type: 'string',
    },
    fontDistFilename: {
      description: '简化后的字体文件名',
      type: 'string',
    },
    fontExts: {
      description: 'webfont字体文件后缀名，默认`[`woff`, `woff2`]`',
      type: 'array',
    },
    additionalSymbols: {
      description: '额外所需的文字, 默认为`[]`',
      type: 'array',
    },
  },
}

const cwd = process.cwd()

class FontMinifyPlugin {
  constructor(options = {}) {
    const _options = Object.assign(
      {
        isFilePath: true,
        fontSource: path.resolve(__dirname, './puhui2/AlibabaPuHuiTi_2_55_Regular.ttf'),
        fontDistDirectory: path.resolve(cwd, './public/fonts'),
        fontDistFilename: 'AlibabaPuHuiTi_2_55_Regular',
        fontExts: ['woff2', 'woff'],
        additionalSymbols: [],
      },
      options
    )
    this.options = _options
    validate(schema, _options)
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
    const options = this.options
    compiler.hooks.initialize.tap(className, () => {
      logger.info(`initialize...`)
      const { isFilePath, words } = options
      // 重新执行webpack时，将之前的文件删除，避免因版本变更导致字体文件越来越大
      if (!isFilePath) return
      const loaderTextPath = path.resolve(os.tmpdir(), words)
      if (!fs.existsSync(loaderTextPath)) return
      logger.info(`删除之前存在的汉字资源文件: ${words}`)
      fs.unlinkSync(loaderTextPath)
    })

    compiler.hooks.thisCompilation.tap(className, (compilation) => {
      compilation.hooks.additionalAssets.tapPromise(className, () => {
        return generateFont(mode, options, logger).then((fonts) => {
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
