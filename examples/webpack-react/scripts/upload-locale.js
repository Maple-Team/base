const { writeFile, readdirSync } = require('node:fs')
const path = require('path')
const http = require('axios')
const { keyBy } = require('lodash')
/**
 * @type {Record<string, string>}
 */
let cnTranslation = {}
const cnTranslationFiles = readdirSync(path.resolve(__dirname, '../src/i18n/zh_CN')).filter((file) =>
  file.endsWith('json')
)
cnTranslationFiles.forEach((file) => {
  cnTranslation = { ...cnTranslation, ...require(path.resolve(__dirname, '../src/i18n/zh_CN', file)) }
})
/**
 * @type {Record<string, string>}
 */
const enTranslationMap = require(path.resolve(__dirname, '../src/i18n/en_US/translation.json'))
/**
 * @type {Record<string, string>}
 */
const hkTranslationMap = require(path.resolve(__dirname, '../src/i18n/zh_HK/translation.json'))
const { version } = require('../package.json')

const locales = [
  { locale: 'zh-CN', data: cnTranslation },
  // { locale: 'zh', data: cnTranslation },
  { locale: 'zh-HK', data: hkTranslationMap },
  { locale: 'en-US', data: enTranslationMap },
  // { locale: 'en', data: enTranslationMap },
]

const uploadLocale = () => {
  locales.forEach((item) => {
    http
      .request({
        method: 'POST',
        url: 'http://localhost:3001/api/minio/update-locale',
        data: {
          data: item.data,
          version,
          locale: item.locale,
          project: 'example',
          ns: 'translation',
        },
      })
      .then((res) => {
        if (res.status < 300) {
          console.log(item.locale + '上传oss成功')
        }
      })
  })
}

const uploadLocales = () => {
  const data = Object.keys(cnTranslation).map((key) => ({
    key,
    zhCN: cnTranslation[key] || '',
    zhHK: hkTranslationMap[key] || '',
    enUS: enTranslationMap[key] || '',
    project: 'example',
  }))
  console.log(data)
  http
    .request({
      method: 'POST',
      url: 'http://localhost:4006/api/locale/batch',
      data,
    })
    .then((res) => {
      if (res.status < 300) {
        console.log(res.data)
      }
    })
}
uploadLocales()
