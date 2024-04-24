import { wrapPromise } from '@/promise'

describe('promise test cases', () => {
  it('case 1', () => {
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() < 0.5) resolve('success')
        else reject(new Error('error'))
      }, 1 * 1000)
    })

    // const res = wrapPromise(promise)

    const getRresult = (r: { read: Function }) => {
      setTimeout(() => {
        const promiseRes = r.read()
        console.log('promiseRes', promiseRes)
      }, 0)
    }

    // getRresult(wrapPromise(promise))
  })
  it('case 2', () => {
    async function getUser() {
      return await new Promise<number>((r) => {
        setTimeout(() => {
          r(1)
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
      if (res.done) {
        console.log(res.value)
      }
    }
    main()
  })
})
