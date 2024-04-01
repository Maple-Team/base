import i18n from 'i18next'
import type { HttpBackendOptions } from 'i18next-http-backend'
import HttpApi from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import enTranslation from './en_US/translation.json'
import hkTranslation from './zh_HK/translation.json'
import cnTranslation from './zh_CN'

const zhCNResources = {
  translation: cnTranslation,
} as const

declare module 'i18next' {
  // Extend CustomTypeOptions
  interface CustomTypeOptions {
    resources: typeof zhCNResources
  }
}
// TODO 环境判断
const resources = {
  // 默认语言
  'zh-CN': {
    // translation 命名空间
    translation: cnTranslation,
  },
  'en-US': {
    translation: enTranslation,
  },
  'zh-HK': {
    translation: hkTranslation,
  },
}
i18n
  // load translation using http -> see /public/locales
  // learn more: https://github.com/i18next/i18next-http-backend
  .use(HttpApi)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init<HttpBackendOptions>({
    // fallbackLng: 'zh-CN', // 回退语言，默认显示的语言
    debug: process.env.NODE_ENV === 'development',
    lng: 'zh-CN',
    // supportedLngs: ['en', 'zh'],
    load: 'all', // FIXME 加速语言切换后快速渲染
    partialBundledLanguages: true,
    resources,
    backend: {},
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  })
  .catch(console.error)

export default i18n
