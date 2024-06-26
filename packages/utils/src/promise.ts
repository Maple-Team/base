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

const run = () => {
  const oldFetch = window.fetch
  let cache: {
    status: 'pending' | 'fullfilled' | 'error'
    value?: unknown
  }
  let promise: PromiseLike<unknown>
  window.fetch = (...args: unknown[]) => {
    promise = oldFetch(...args)
      .then((r) => r.json())
      .then((v) => {
        cache.status = 'fullfilled'
        cache.value = v
      })
      .catch((e) => {
        cache.status = 'error'
        cache.value = e
      })
  }
}
