import { useEffect, useState } from 'react'

/**
 * async hook
 *
 * 处理 Race Condition
 * 缓存网络请求
 * 缓存刷新
 * 兼容 React 18 Concurrent Rendering
 * 请求合并去重
 * 更多，我还要更多
 * @https://blog.skk.moe/post/why-you-should-not-fetch-data-directly-in-use-effect/
 * @param src
 * @param options
 * @returns
 */
export const useAsync = <T>(src: string, options?: RequestInit) => {
  const [isLoading, setLoading] = useState<boolean>()
  const [data, setData] = useState<T>()
  const [error, setError] = useState<Error>()

  useEffect(() => {
    const doAsync = (src: string) => {
      setLoading(true)
      fetch(src, { ...options })
        .then((res) => res.json())
        .then((data: T) => {
          console.log(data)
          setData(data)
        })
        .catch((e: Error) => {
          setError(e)
          console.error(e)
        })
        .finally(() => {
          setLoading(false)
        })
    }
    doAsync(src)
  }, [src])

  return { isLoading, error, data }
}
