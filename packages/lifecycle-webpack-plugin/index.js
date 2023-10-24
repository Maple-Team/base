const { avaliableMethods, compilationMethods } = require('./constant')
const { dealCamelToLine } = require('./utils')

class LifeCycleWebpackPlugin {
  constructor(opts) {
    // for (const name in opts) {
    //     if (!isFunction(opts[name])) {
    //         throw new Error(`${name} is not a function`);
    //     }
    // }
    this.opts = opts
  }

  /**
   *
   * @param {import('webpack').Compiler} compiler
   * @returns
   */
  definePlugin = (compiler, methods) => {
    const className = this.constructor.name
    methods.forEach((method) => {
      compiler.hooks[dealCamelToLine(method.method)].tap(className, (...args) => {
        this.opts[method.method](compiler)
        if (method.isAsync) args[args.length - 1]()
      })
    })
  }

  /**
   *
   * @param {import('webpack').Compiler} compiler
   * @returns
   */
  apply(compiler) {
    const avaliableContainMethods = []
    const complitionContainMethods = []
    const className = this.constructor.name
    for (const name in this.opts) {
      console.log(name, 'name', dealCamelToLine(name))
      if (avaliableMethods.filter((method) => method.method.includes(name)).length) {
        // 如果是直接使用的事件
        avaliableContainMethods.push(name)
      } else if (compilationMethods.filter((method) => method.method.includes(name)).length) {
        // 如果是必须在complication事件下使用的
        complitionContainMethods.push(name)
      }
    }

    this.definePlugin(
      compiler,
      avaliableMethods.filter((method) => avaliableContainMethods.includes(method.method))
    )

    if (complitionContainMethods.length) {
      compiler.hooks.compilation.tap(className, (compilation) => {
        this.definePlugin(
          compilation,
          compilationMethods.filter((method) => complitionContainMethods.includes(method.method))
        )
      })
    }
  }
}

module.exports = LifeCycleWebpackPlugin
