;(function () {
  const defaultContentBgColor = '#41b883'
  const defaultTitleBgColor = '#35495e'

  const colorFulContent = function (option) {
    const title = option.title
    const content = option.content
    const contentBgColor = option.contentBgColor || defaultContentBgColor
    const titleBgColor = option.titleBgColor || defaultTitleBgColor
    const consoleContent = [
      '%c '.concat(title, ' %c ').concat(content, ' '),
      'padding: 1px; border-radius: 3px 0 0 3px; color: #fff; background: '.concat(titleBgColor, ';'),
      'padding: 1px; border-radius: 0 3px 3px 0; color: #fff; background: '.concat(contentBgColor, ';'),
    ]
    return (function () {
      console.log(console, consoleContent)
    })()
  }

  return colorFulContent
})()
