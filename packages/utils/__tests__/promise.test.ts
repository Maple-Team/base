import { catchError, catchErrorTyped } from '@/promise'

describe('promise test cases', () => {
  // it('case 1', () => {
  //   const promise = new Promise((resolve, reject) => {
  //     setTimeout(() => {
  //       if (Math.random() < 0.5) resolve('success')
  //       else reject(new Error('error'))
  //     }, 1 * 1000)
  //   })

  //   // const res = wrapPromise(promise)

  //   const getResult = (r: { read: Function }) => {
  //     setTimeout(() => {
  //       const promiseRes = r.read()
  //       console.log('promiseRes', promiseRes)
  //     }, 0)
  //   }

  //   // getResult(wrapPromise(promise))
  // })
  it('case 2', () => {
    async function getUser() {
      return await new Promise<number>((resolve) => {
        setTimeout(() => {
          resolve(1)
        }, 3000)
      })
    }
    const m1 = function* (): IterableIterator<unknown> {
      const res = yield getUser()
      return res
    }
    function m2() {
      const user = m1()
      return user
    }
    function m3() {
      const user = m2()
      return user
    }
    function main() {
      const user = m3()
      const res = user.next()
      if (res.done) console.log(res.value)
    }
    main()
  })
})

describe('catchError', () => {
  test('should resolve with [undefined, value] when promise resolves', async () => {
    const promise = Promise.resolve('value')
    const result = await catchError(promise)
    expect(result).toEqual([undefined, 'value'])
  })

  test('should resolve with [error] when promise rejects', async () => {
    const promise = Promise.reject(new Error('error'))
    const result = await catchError(promise)
    expect(result).toEqual([new Error('error')])
  })
})

describe('catchErrorTyped', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let promise: Promise<any>

  beforeEach(() => {
    promise = Promise.resolve('resolved value')
  })

  test('should return [undefined, resolved value] when promise resolves', async () => {
    const result = await catchErrorTyped(promise)
    expect(result).toEqual([undefined, 'resolved value'])
  })

  test('should return [error] when promise rejects and no errorsToCatch provided', async () => {
    promise = Promise.reject(new Error('rejected error'))
    const result = await catchErrorTyped(promise)
    expect(result).toEqual([new Error('rejected error')])
  })

  test('should return [error] when promise rejects and error is in errorsToCatch', async () => {
    class CustomError extends Error {}
    promise = Promise.reject(new CustomError('rejected error'))
    const result = await catchErrorTyped(promise, [CustomError])
    expect(result).toEqual([new CustomError('rejected error')])
  })

  test('should throw error when promise rejects and error is not in errorsToCatch', async () => {
    promise = Promise.reject(new Error('rejected error'))
    class CustomError extends Error {}
    await expect(catchErrorTyped(promise, [CustomError])).rejects.toThrow(new Error('rejected error'))
  })
})
