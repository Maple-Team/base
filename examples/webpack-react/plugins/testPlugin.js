const os = require('os')
const path = require('path')
const fs = require('fs')
const { generateLato, generatePuhui3500, generatePuhuiMini } = require('./fontmin')

const cwd = process.cwd()

const { name } = require(`${cwd}/package.json`)

class TestPlugin {
  /**
   *
   * @param {import('webpack').Compiler} compiler
   * @returns
   */
  apply(compiler) {
    const className = this.constructor.name
    const mode = compiler.options.mode
    compiler.hooks.beforeRun.tap(className, () => {
      // console.log('==================beforeRun==================')
      const loaderTextPath = path.resolve(os.tmpdir(), `chinese-extract-loader-${name}.txt`)
      if (fs.existsSync(loaderTextPath)) fs.unlinkSync(loaderTextPath)
    })
    compiler.hooks.emit.tapPromise(className, () => {
      // console.log('==================emit==================')
      return Promise.all([generateLato(), generatePuhui3500(), generatePuhuiMini(mode)])
    })
  }
}

module.exports = TestPlugin
