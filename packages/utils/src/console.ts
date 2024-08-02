interface ConsoleContent {
  key: string
  value: string
  valueBgColor?: string
  keyBgColor?: string
  textColor?: string
  contentColor?: string
}

/**
 * 在控制台输出带颜色的内容
 * @param opts
 */
export const consoleFn = (opts: ConsoleContent) => {
  const defaultContentBgColor = '#41b883'
  const defaultTitleBgColor = '#35495e'
  const defaultTextColor = '#FFFFFF'

  const key = opts.key
  const value = opts.value
  const valueColor = opts.valueBgColor || defaultContentBgColor
  const keyColor = opts.keyBgColor || defaultTitleBgColor
  const textColor = opts.textColor || defaultTextColor
  const contentColor = opts.contentColor || defaultTextColor

  const contents = [
    '%c '.concat(key, ' %c ').concat(value, ' '),
    `padding: 1px; border-radius: 3px 0 0 3px; color: ${textColor}; background: `.concat(keyColor, ';'),
    `padding: 1px; border-radius: 0 3px 3px 0; color: ${contentColor}; background: `.concat(valueColor, ';'),
  ]

  console.log.apply(null, contents)
}
