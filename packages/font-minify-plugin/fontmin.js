const path = require('path')
const fs = require('fs')
const Fontmin = require('fontmin')

const cwd = process.cwd()

const _generateFonts = async (texts, distPath, fontSource, fontExts) => {
  return new Promise((resolve) => {
    const fontmin = new Fontmin().src(fontSource).use(Fontmin.glyph({ text: texts, hinting: false }))

    if (fontExts.includes('woff')) fontmin.use(Fontmin.ttf2woff())
    if (fontExts.includes('woff2')) fontmin.use(Fontmin.ttf2woff2())

    fontmin.dest(distPath).run((err) => {
      if (err) throw err
      // 清除不必要的ttf文件
      const ttfFiles = fs.readdirSync(distPath)
      ttfFiles.forEach((file) => {
        if (file.endsWith('.ttf')) fs.unlinkSync(`${distPath}/${file}`)
      })
      resolve()
    })
  })
}

const generateFont = async (mode, options, logger) => {
  const {
    additionalSymbols,
    fontDistDirectory: minifyFontDir,
    fontExts,
    fontDistFilename,
    isFilePath,
    words,
    fontSource,
  } = options

  const minifyFonts = fontExts.map((ext) => `${fontDistFilename}.${ext}`)

  const fonts = fs.readdirSync(minifyFontDir).filter((file) => file.startsWith(fontDistFilename))
  if (minifyFonts.every((font) => fonts.includes(font)) && mode === 'development') {
    logger.info('开发模式下存在简化字体文件，不再生成新的简化字体文件')
    return
  }
  let uniqueText
  if (isFilePath) {
    const tempTexts = fs.readFileSync(words).toString().split('')
    uniqueText = Array.from(new Set([...tempTexts, ...additionalSymbols])).join('')
  } else {
    uniqueText = Array.from(new Set([...words, ...additionalSymbols])).join('')
  }

  logger.info(`精简字体的字数: ${uniqueText.length}个`)

  await _generateFonts(uniqueText, minifyFontDir, fontSource, fontExts)

  const result = []
  const miniFiles = fs.readdirSync(minifyFontDir).filter((file) => !file.endsWith('.ttf'))
  miniFiles.forEach((file) => {
    const content = fs.readFileSync(`${minifyFontDir}/${file}`)
    result.push({ filename: `fonts/${file}`, content, size: content.length })
  })
  return result
}
const generatePuhui3500 = async () => {
  const puhui3500Fonts = [
    'AlibabaPuHuiTi_2_55_Regular.woff',
    'AlibabaPuHuiTi_2_55_Regular.woff2',
    'AlibabaPuHuiTi_2_65_Medium.woff',
    'AlibabaPuHuiTi_2_65_Medium.woff2',
  ]
  const word3500Path = path.resolve(cwd, './public/fonts')
  const fonts = fs.readdirSync(word3500Path).filter((file) => file.startsWith('Alibaba'))
  if (puhui3500Fonts.every((font) => fonts.includes(font))) return
  try {
    const word3500 = fs
      .readFileSync(path.resolve(__dirname, './3500changyong-han.txt'))
      .toString()
      .split('\r\n')
      .filter(Boolean)
      .join('')

    await _generateFonts(word3500, word3500Path, './puhui')
  } catch (err) {
    console.error(err)
  }
}
const generateLato = async () => {
  const miniDistPath = path.resolve(cwd, './public/fonts')
  const latoFonts = ['Lato-Bold.woff', 'Lato-Bold.woff2', 'Lato-Regular.woff', 'Lato-Regular.woff2']
  const fonts = fs.readdirSync(miniDistPath).filter((file) => file.startsWith('Alibaba'))
  if (latoFonts.every((font) => fonts.includes(font))) return

  try {
    const asciWords = []
    // 添加95个基本阿拉丁字母
    for (let i = 0x20; i <= 0x7e; i++) asciWords.push(String.fromCharCode(i))

    asciWords.push('°') // 添加°

    await _generateFonts(asciWords, miniDistPath, './lato')
  } catch (err) {
    console.error(err)
  }
}

module.exports = { generateFont, generateLato, generatePuhui3500 }
