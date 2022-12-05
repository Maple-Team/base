const path = require('path')
const fs = require('fs')
const dayjs = require('dayjs')
const loaderName = 'maple-pattern-loader'

// @https://redd.one/blog/writing-custom-webpack-loader
// @https://webpack.js.org/contribute/writing-a-loader/

fs.writeFile(
  path.resolve(__dirname, `../${loaderName}.log`),
  `--------------华丽的分隔线--------------\r\n`,
  { flag: 'a+' },
  () => {}
)

module.exports = function (source) {
  // const filename = path.basename(this.resourcePath)
  // const assetInfo = { sourceFilename: filename }
  // this.emitFile(filename, source, null, assetInfo)
  const logger = this.getLogger()
  const content = `${loaderName} is handing file: ${this.resourcePath}`
  logger.info(content)

  fs.writeFile(
    path.resolve(__dirname, `../${loaderName}.log`),
    `[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] ${content}\r\n`,
    { flag: 'a+' },
    () => {}
  )
  return source
}
