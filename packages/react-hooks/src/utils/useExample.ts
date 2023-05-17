import { useCallback, useEffect, useRef, useState } from 'react'

export const useTimeout = () => {
  const [num, setNum] = useState(0)
  useEffect(() => {
    setTimeout(() => {
      setNum(1)
    }, 1000)
  }, [])
  return num
}

/**
 * useInterval
 *
 * 使用 `setInterval` 也是可以的，但是需要注意一些细微的差别。

`setInterval` 是一个周期性执行的定时器，它会按照指定的时间间隔重复执行函数。与 `setTimeout` 不同，`setInterval` 并不会在每次函数执行完成后等待指定的时间间隔，而是在时间间隔到达后立即执行函数。

如果在 React 组件中使用 `setInterval`，可能会遇到一些问题。由于 `setInterval` 是周期性执行的，它会在每个时间间隔到达时触发函数，而不会考虑组件的重新渲染。这可能导致在组件被卸载后，`setInterval` 仍然继续触发函数，从而引发错误或内存泄漏。

为了解决这个问题，我们需要在组件卸载时手动清除 `setInterval`，以防止它继续触发函数。可以使用 `clearInterval` 函数来清除 `setInterval`，需要保存 `setInterval` 返回的标识符，以便后续清除。

这也是为什么在使用 `setInterval` 时，仍然需要使用 `useEffect` 和 `return` 清理函数来确保在组件卸载时清除定时器。

综上所述，使用 `setInterval` 需要额外的手动清理工作，并且需要注意在组件卸载时清除定时器，以避免潜在的问题。相比之下，使用 `setTimeout` 和 `useRef` 来创建定时器，可以更简单地管理定时器的生命周期，并在组件重新渲染时自动处理清理工作。
 * @param fn
 * @param delay
 * @returns
 */
export const useInterval = (fn: Fn, delay?: number) => {
  const timerRef = useRef<NodeJS.Timeout>()

  const clear = useCallback(() => {
    clearTimeout(timerRef.current)
  }, [])

  useEffect(() => {
    const poll = async () => {
      try {
        await fn()
      } catch (error) {
        console.error(error)
      } finally {
        timerRef.current = setTimeout(() => {
          poll().catch(console.log)
        }, delay || 0)
      }
    }

    timerRef.current = setTimeout(() => {
      poll().catch(console.log)
    }, delay || 0)

    return clear
  }, [fn, delay, clear])

  return clear
}

export const useInterval2 = (fn: () => void, delay?: number, options: { immediate?: boolean } = {}) => {
  const timerRef = useRef<NodeJS.Timeout>()

  const clear = useCallback(() => {
    clearInterval(timerRef.current)
  }, [])

  useEffect(() => {
    if (Number.isNaN(delay) || (delay && delay < 0)) return

    if (options.immediate) fn()

    timerRef.current = setInterval(fn, delay)
    return clear
  }, [clear, delay, fn, options.immediate])

  return clear
}
