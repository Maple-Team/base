// eslint-disable-next-line no-unused-vars, unused-imports/no-unused-vars
function print() {
  const defaultContentBgColor = '#41b883'
  const defaultTitleBgColor = '#35495e'
  const defaultTextColor = '#FFFFFF'

  const colorFulContent = function (option) {
    const title = option.title
    const content = option.content
    const contentBgColor = option.contentBgColor || defaultContentBgColor
    const titleBgColor = option.titleBgColor || defaultTitleBgColor
    const titleColor = option.titleColor || defaultTextColor
    const contentColor = option.contentColor || defaultTextColor

    const consoleContent = [
      '%c '.concat(title, ' %c ').concat(content, ' '),
      `padding: 1px; border-radius: 3px 0 0 3px; color: ${titleColor}; background: `.concat(titleBgColor, ';'),
      `padding: 1px; border-radius: 0 3px 3px 0; color: ${contentColor}; background: `.concat(contentBgColor, ';'),
    ]

    console.log.apply(null, consoleContent)
  }

  return function (arg) {
    colorFulContent(arg)
  }
}
