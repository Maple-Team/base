/*
 * @Description:
 * @Author: Liutsing
 * @Date: 2023-02-09 14:51:40
 */
/**
 * 计算元素的左侧偏移量
 * [getBoundClientRect](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect), 相对viewport
 * NOTE 样式存在偏移的元素的问题
 * @param el
 * @returns
 */
export const getElementViewLeft = (el: HTMLElement) => {
  let offsetLeft = el.offsetLeft

  let current: HTMLElement | null = el.offsetParent as HTMLElement
  const elementScrollLeft = document.body.offsetLeft + document.documentElement.offsetLeft

  // if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement) {
  if (!document.fullscreenElement) {
    // NOTE polyfill?
    while (current !== null) {
      // 需要修正
      offsetLeft += current.offsetLeft
      current = current.offsetParent as HTMLElement
    }
  } else {
    while (current !== null && current !== el) {
      offsetLeft += current.offsetLeft
      current = current.offsetParent as HTMLElement
    }
  }

  return offsetLeft - elementScrollLeft
}
