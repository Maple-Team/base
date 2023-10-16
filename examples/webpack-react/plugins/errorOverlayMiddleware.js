// const errorOverlayMiddleware = require('react-dev-utils/errorOverlayMiddleware')

class ErrorOverlayPlugin {
  /**
   *
   * @param {import('webpack').Compiler} compiler
   * @returns
   */
  apply(compiler) {
    const className = this.constructor.name

    if (compiler.options.mode !== 'development') return
    console.log(compiler.options.mode)
    compiler.hooks.done.tap(className, () => {
      console.log('Hello World!')
    })
    // compiler.hooks.entryOption.tap(className, (context, entry) => {
    //   const chunkPath = require.resolve('./entry')
    //   adjustEntry(entry, chunkPath)
    // })
    // compiler.hooks.afterResolvers.tap(className, ({ options }) => {
    //   if (options.devServer) {
    //     const originalBefore = options.devServer.onBeforeSetupMiddleware
    //     options.devServer.onBeforeSetupMiddleware = (app, server) => {
    //       if (originalBefore) originalBefore(app, server)
    //       app.use(errorOverlayMiddleware())
    //     }
    //   }
    // })
  }
}

/**
 *
 * @param {import('webpack').EntryNormalized} entry
 * @param {string} chunkPath
 */
function _adjustEntry(entry, chunkPath) {
  if (Array.isArray(entry)) {
    if (!entry.includes(chunkPath)) entry.unshift(chunkPath)
  } else {
    Object.keys(entry).forEach((entryName) => {
      entry[name] = _adjustEntry(entry[entryName], chunkPath)
    })
  }
}

module.exports = ErrorOverlayPlugin
