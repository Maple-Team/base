const { writeFile, readdirSync } = require('node:fs')
const path = require('path')

let cnTranslation = {}
const cnTranslationFiles = readdirSync(path.resolve(__dirname, '../src/i18n/zh_CN')).filter((file) =>
  file.endsWith('json')
)
cnTranslationFiles.forEach((file) => {
  cnTranslation = { ...cnTranslation, ...require(path.resolve(__dirname, '../src/i18n/zh_CN', file)) }
})

const enTranslationMap = require(path.resolve(__dirname, '../src/i18n/en_US/translation.json'))
const hkTranslationMap = require(path.resolve(__dirname, '../src/i18n/zh_HK/translation.json'))

const { version } = require('../package.json')

const http = require('axios')

;[
  { locale: 'zh-CN', data: cnTranslation },
  // { locale: 'zh', data: cnTranslation },
  { locale: 'zh-HK', data: hkTranslationMap },
  { locale: 'en-US', data: enTranslationMap },
  // { locale: 'en', data: enTranslationMap },
].forEach((item) => {
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
