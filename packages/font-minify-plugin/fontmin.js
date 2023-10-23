const os = require('os')
const path = require('path')
const fs = require('fs')
const Fontmin = require('fontmin')

const cwd = process.cwd()
const { name } = require(`${cwd}/package.json`)

const extract = async (texts, distPath, sourcePath) => {
  return new Promise((resolve) => {
    const sourceTTF = path.resolve(__dirname, sourcePath)

    const fontmin = new Fontmin()
      .src(`${sourceTTF}/*.ttf`)
      .use(Fontmin.glyph({ text: texts, hinting: false }))
      .use(Fontmin.ttf2woff())
      .use(Fontmin.ttf2woff2())
      .dest(distPath)

    fontmin.run((err) => {
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

const generatePuhui = async (mode) => {
  let loaderTextPath
  try {
    const miniDistPath = path.resolve(cwd, './public/fonts')
    const miniFonts = [
      'AlibabaPuHuiTi_2_55_Regular.woff',
      'AlibabaPuHuiTi_2_55_Regular.woff2',
      'AlibabaPuHuiTi_2_65_Medium.woff',
      'AlibabaPuHuiTi_2_65_Medium.woff2',
    ]
    const fonts = fs.readdirSync(miniDistPath).filter((file) => file.startsWith('Alibaba'))
    if (miniFonts.every((font) => fonts.includes(font)) && mode === 'development') return

    loaderTextPath = path.resolve(os.tmpdir(), `chinese-extract-loader-${name}.txt`)
    const tempTexts = fs.readFileSync(loaderTextPath).toString().split('')
    const symbols = ['℃']
    const uniqueText = Array.from(new Set([...tempTexts, ...symbols])).join('')

    console.log(`读取: ${loaderTextPath} 中的文字进行精简字体, 字数: ${uniqueText.length}`)

    await extract(uniqueText, miniDistPath, './puhui')

    const result = []
    const miniFiles = fs.readdirSync(miniDistPath).filter((file) => !file.endsWith('.ttf'))
    miniFiles.forEach((file) => {
      const content = fs.readFileSync(`${miniDistPath}/${file}`)
      result.push({ filename: `fonts/${file}`, content, size: content.length })
    })
    return result
  } catch (err) {
    console.error(err)
    // console.warn(`注: ${loaderTextPath}, 还未存在，需要先运行一次项目后才生成精简字体`)
  }
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

    await extract(word3500, word3500Path, './puhui')
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

    await extract(asciWords, miniDistPath, './lato')
  } catch (err) {
    console.error(err)
  }
}

module.exports = { generatePuhui, generateLato, generatePuhui3500 }
