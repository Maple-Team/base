export const throttle = (fn: Fn) => {
  let timer: number
  return (e?: Event) => {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn(e)
    }, 300) as unknown as number
  }
}
