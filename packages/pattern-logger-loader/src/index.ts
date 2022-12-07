import type * as webpack from 'webpack'
import fs from 'fs'
import { LoaderOptions } from './interfaces'

const loaderName = 'pattern-logger-loader'

const _showGap = (filePath: string) => {
  fs.writeFile(filePath, `--------------华丽的分隔线--------------\r\n`, { flag: 'a+' }, () => {})
}
const getDateString = () => {
  const date = new Date()
  return `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}
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
        return `[${getDateString()}] ${content}\r\n`
      },
    } as Partial<LoaderOptions>,
    loaderOptions
  )

  if (options.silent) {
    return source
  }
  const resourcePath = this.resourcePath
  const content = options.formater!(resourcePath)
  if (options.showLogger) {
    const logger = this.getLogger(loaderName)
    logger.info(content)
  }

  if (options.saveToDisk && options.logFileName) {
    fs.writeFile(options.logFileName, content, { flag: 'a+' }, () => {})
  } else {
    throw new TypeError(`${options.logFileName} is null, 日志文件名必须设置`)
  }
  return source
}

export * from './interfaces'
export default Loader
