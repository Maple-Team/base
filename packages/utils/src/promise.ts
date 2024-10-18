export function wrapPromise<R>(promise: Promise<R>) {
  let status = 'pending'
  let result: R
  const suspender = promise.then(
    (r) => {
      status = 'success'
      result = r
    },
    (e) => {
      status = 'error'
      result = e
    }
  )

  return {
    read() {
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      if (status === 'pending') throw suspender
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      else if (status === 'error') throw result
      else if (status === 'success') return result
    },
  }
}

export const run = () => {
  const oldFetch = window.fetch
  let cache: {
    status: 'pending' | 'fullfilled' | 'error'
    value?: unknown
  }
  let _promise: PromiseLike<unknown>
  // @ts-expect-error:xx
  window.fetch = (...args: unknown[]) => {
    // @ts-expect-error:xx
    promise = oldFetch(...args)
      .then((r) => r.json())
      .then((v) => {
        // @ts-expect-error: xx
        cache.status = 'fullfilled'
        // @ts-expect-error: xx
        cache.value = v
      })
      .catch((e) => {
        // @ts-expect-error: xx
        cache.status = 'error'
        // @ts-expect-error: xx
        cache.value = e
      })
  }
}
/**
 * 替代try catch来捕捉异步错误
 * @param promise
 * @returns
 */
export function catchError<T>(promise: Promise<T>): Promise<[undefined, T] | [Error]> {
  return promise.then((v) => [undefined, v] as [undefined, T]).catch((e) => [e])
}

/**
 * 替代try catch来捕捉异步错误，可以指定捕捉特殊的错误类型
 * @param promise
 * @param errorsToCatch
 * @returns
 */
export function catchErrorTyped<T, E extends new (message?: string) => Error>(
  promise: Promise<T>,
  errorsToCatch?: E[]
): Promise<[undefined, T] | [InstanceType<E>]> {
  return promise
    .then((v) => [undefined, v] as [undefined, T])
    .catch((e) => {
      if (errorsToCatch === undefined) return [e]
      if (errorsToCatch.some((error) => e instanceof error)) return [e]

      throw e
    })
}
