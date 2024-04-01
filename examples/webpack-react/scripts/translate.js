const { writeFile, readdirSync } = require('node:fs')
const path = require('path')
const { Translate } = require('@google-cloud/translate').v2

// NOTE 使用前需要挂代理
// $Env:http_proxy="http://127.0.0.1:7890";$Env:https_proxy="http://127.0.0.1:7890"

async function googleTranslate(text, target) {
  return new Promise((resolve) => {
    ;(async () => {
      const translate = new Translate({ key: 'AIzaSyC-jt2CdwvjrjggEpT9XTKEaju0EdqQG2M' })

      let [translations] = await translate.translate(text, target)
      translations = Array.isArray(translations) ? translations : [translations]
      resolve(translations[0])
    })()
  })
}

/**
 * 多语种翻译
 * @param {string} key
 * @returns
 */
const translates = (key) => {
  return Promise.all([googleTranslate(key, 'en_US'), googleTranslate(key, 'zh_HK')]).then((res) => {
    return {
      en: res[0],
      hk: res[1],
    }
  })
}

// eslint-disable-next-line import/newline-after-import
const start = async () => {
  const cnTranslationFiles = readdirSync(path.resolve(__dirname, '../src/i18n/zh_CN')).filter((file) =>
    file.endsWith('json')
  )

  let cnTranslation = {}
  cnTranslationFiles.forEach((file) => {
    cnTranslation = { ...cnTranslation, ...require(path.resolve(__dirname, '../src/i18n/zh_CN', file)) }
  })

  //   console.log('中文语言包', cnTranslation)

  const enTranslationMap = {}
  const hkTranslationMap = {}
  for await (const key of Object.keys(cnTranslation)) {
    const value = cnTranslation[key]
    const { en, hk } = await translates(value)

    enTranslationMap[key] = en || ''
    hkTranslationMap[key] = hk || ''
  }

  writeFile(
    path.resolve(__dirname, '../src/i18n/en_US/translation.json'),
    JSON.stringify(enTranslationMap, null, 2),
    (e) => {
      if (e) {
        console.error(e)
      } else {
        console.log('英文翻译更新完')
      }
    }
  )
  writeFile(
    path.resolve(__dirname, '../src/i18n/zh_HK/translation.json'),
    JSON.stringify(hkTranslationMap, null, 2),
    (e) => {
      if (e) {
        console.error(e)
      } else {
        console.log('繁体翻译更新完')
      }
    }
  )
}
start()

// ;(async () => {
//   const res = await translateTextSample('远程驾驶', 'en-US')
//   console.log(res)
// })()
