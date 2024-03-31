export const LanguageNameMap = {
  en: 'English',
  'zh-CN': '中文(简体)',
  'zh-TW': '中文(繁體)',
} as const

export type LanguageKey = keyof typeof LanguageNameMap
