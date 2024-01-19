const path = require('path')
const fs = require('fs')
const Fontmin = require('fontmin')
const { Font, woff2 } = require('fonteditor-core')

const cwd = process.cwd()

const generateFontsWithFontMin = async (texts, distPath, fontSource, fontExts) => {
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
const getTextUnicode = (text) => {
  return text.charCodeAt(0)
}
const readFontOption = {
  // support ttf, woff, woff2, eot, otf, svg
  type: 'ttf',
  // save font hinting
  hinting: true,
  // transform ttf compound glyph to simple
  compound2simple: true,
  // inflate function for woff
  inflate: undefined,
  // for svg path
  combinePath: false,
}
const writeFontOption = {
  // save font hinting, default false
  hinting: true,
  // write glyf data when simple glyph has no contours, default false
  writeZeroContoursGlyfData: false,
  // deflate function for woff, eg. pako.deflate
  deflate: undefined,
  // for user to overwrite head.xMin, head.xMax, head.yMin, head.yMax, hhea etc.
  support: { head: {}, hhea: {} },
}
const generateFontsWithFontForge = async (texts, distPath, fontSource, fontDistFilename) => {
  const unicodes = texts.split('').map(getTextUnicode)
  const buffer = fs.readFileSync(fontSource)
  const font = Font.create(buffer, {
    // support ttf, woff, woff2, eot, otf, svg
    type: 'ttf',
    subset: unicodes,
    ...readFontOption,
  })

  const woffPromise = new Promise((resolve) => {
    const subSetBuffer = font.write({
      // support ttf, woff, woff2, eot, svg
      type: 'woff',
      ...writeFontOption,
    })
    fs.writeFileSync(`${distPath}/${fontDistFilename}.woff`, subSetBuffer)
    resolve()
  })
  const woff2Promise = new Promise((resolve) => {
    woff2
      .init()
      .then(() => {
        const subSetBuffer = font.write({
          // support ttf, woff, woff2, eot, svg
          type: 'woff2',
          ...writeFontOption,
        })
        fs.writeFileSync(`${distPath}/${fontDistFilename}.woff2`, subSetBuffer)
        resolve()
      })
      .catch(console.error)
  })
  return Promise.all([woffPromise, woff2Promise])
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
    let tempTexts = ''
    try {
      // NOTE 因缓存可能导致这个文件不存在
      tempTexts = fs.readFileSync(words).toString().split('')
    } catch (error) {}
    uniqueText = Array.from(new Set([...tempTexts, ...additionalSymbols])).join('')
  } else {
    uniqueText = Array.from(new Set([...words, ...additionalSymbols])).join('')
  }

  logger.info(`精简字体的字数: ${uniqueText.length}个`)

  await generateFontsWithFontForge(uniqueText, minifyFontDir, fontSource, fontDistFilename)
  // await generateFontsWithFontMin(uniqueText, minifyFontDir, fontSource, fontExts)

  const result = []
  const miniFiles = fs.readdirSync(minifyFontDir).filter((file) => !file.endsWith('.ttf'))
  miniFiles.forEach((file) => {
    const content = fs.readFileSync(`${minifyFontDir}/${file}`)
    result.push({ filename: `fonts/${file}`, content, size: content.length })
  })
  return result
}

/**
 * 生成常用的3500字
 * @returns
 */
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

    await generateFontsWithFontMin(word3500, word3500Path, './puhui')
  } catch (err) {
    console.error(err)
  }
}
/**
 * 生成ASCII码
 * @returns
 */
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

    await generateFontsWithFontMin(asciWords, miniDistPath, './lato')
  } catch (err) {
    console.error(err)
  }
}

module.exports = { generateFont, generateLato, generatePuhui3500 }
