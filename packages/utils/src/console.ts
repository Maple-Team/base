interface ConsoleContent {
  key: string
  value: string
  valueBgColor?: string
  keyBgColor?: string
  textColor?: string
}
export const consoleFn = (opts: ConsoleContent) => {
  // const f = '#42c02e'
  const key = opts.key
  const value = opts.value
  const valueColor = opts.valueBgColor || '#41b883'
  const keyColor = opts.keyBgColor || '#35495e'
  const textColor = opts.textColor || '#ffffff'

  const contents = [
    '%c '.concat(key, ' %c ').concat(value, ' '),
    `padding: 1px; border-radius: 3px 0 0 3px; color: ${textColor}; background: `.concat(keyColor, ';'),
    `padding: 1px; border-radius: 0 3px 3px 0; color: ${textColor}; background: `.concat(valueColor, ';'),
  ]

  console.log.apply(null, contents)
}
