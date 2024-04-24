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
