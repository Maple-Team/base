const os = require('os')
const path = require('path')
const fs = require('fs')
const { generatePuhuiMini } = require('./fontmin')

const cwd = process.cwd()

const { name } = require(`${cwd}/package.json`)

class FontMinPlugin {
  /**
   *
   * @param {import('webpack').Compiler} compiler
   * @returns
   */
  apply(compiler) {
    const className = this.constructor.name
    const mode = compiler.options.mode
    compiler.hooks.beforeRun.tap(className, () => {
      const logger = compiler.getInfrastructureLogger(className)
      logger.info(`beforeRun...`)
      // 重新执行webpack时，将之前的文件删除，避免因版本变更导致字体文件越来越大
      const loaderTextPath = path.resolve(os.tmpdir(), `chinese-extract-loader-${name}.txt`)
      if (fs.existsSync(loaderTextPath)) {
        logger.info(`删除之前存在的汉字资源文件`)
        fs.unlinkSync(loaderTextPath)
      }
    })
    compiler.hooks.emit.tapPromise(className, (compilation) => {
      const logger = compiler.getInfrastructureLogger(className)
      logger.info(`准备生成字体资源`)
      return Promise.all([
        // generateLato(), generatePuhui3500(),
        generatePuhuiMini(mode),
      ]).then((fonts) => {
        if (!fonts || !fonts.length) return
        logger.info(`生成字体资源`)
        Array.prototype.concat.apply([], fonts).forEach((font) => {
          compilation.assets[font.filename] = {
            buffer: () => font.buffer,
            size: () => font.size,
          }
        })
      })
    })
    // compiler.hooks.thisCompilation.tap(className, (compilation) => {
    //   compilation.hooks.processAssets.tap(
    //     {
    //       name: className,
    //       stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
    //       additionalAssets: true,
    //     },
    //     (assets) => {
    //       const logger = compiler.getInfrastructureLogger(className)

    //       logger.info('processAssets')
    //       console.log('List of assets and their sizes:')
    //       Object.entries(assets).forEach(([pathname, source]) => {
    //         console.log(`— ${pathname}: ${source.size()} bytes`)
    //       })
    //       // return Promise.all([generateLato(), generatePuhui3500(), generatePuhuiMini(mode)]).then((fonts) => {
    //       //   if (!fonts || !fonts.length) return
    //       //   logger.info(`添加字体资源, 字体数:`, fonts.length)
    //       //   Array.prototype.concat.apply([], fonts).forEach((font) => {
    //       //     assets[font.filename] = {
    //       //       buffer: () => font.buffer,
    //       //       size: () => font.size,
    //       //     }
    //       //   })
    //       // })
    //     }
    //   )
    // })
  }
}

module.exports = FontMinPlugin
