import fs from 'fs'
import type * as webpack from 'webpack'
import { dateFormat } from '@liutsing/utils'
import type { LoaderOptions } from './interfaces'

const loaderName = 'pattern-logger-loader'

function Loader(this: webpack.LoaderContext<LoaderOptions>, source: string) {
  const loaderOptions = this.getOptions()
  const options = Object.assign(
    {},
    {
      silent: false,
      showLogger: false,
      saveToDisk: false,
      formater: (resourcePath) => {
        const content = `${loaderName} is handing file: ${resourcePath}`
        return `[${dateFormat()}] ${content}\r\n`
      },
      logFileName: `${loaderName}.log`,
    } as Partial<LoaderOptions>,
    loaderOptions
  )

  if (options.silent) return source

  const resourcePath = this.resourcePath
  const content = options.formater ? options.formater(resourcePath) : resourcePath
  if (options.showLogger) {
    const logger = this.getLogger(loaderName)
    logger.info(content)
  }

  if (options.logFileName) {
    fs.writeFile(options.logFileName, content, { flag: 'a+' }, (e) => {
      if (e) throw e
    })
  }
  return source
}

export * from './interfaces'
export default Loader
