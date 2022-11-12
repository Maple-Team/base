import { removeItem } from '@/array'

describe('array test cases', () => {
  describe('remove item form array', () => {
    it('case 1', () => {
      const array = [1, 2, 3, 4, 5]
      expect(removeItem(array, 2)).toStrictEqual([1, 3, 4, 5])
    })
    it('case 2', () => {
      const array = [1, 2, 3, 4, 5]
      expect(removeItem(array, 2, (a, b) => a.indexOf(b))).toStrictEqual([1, 3, 4, 5])
    })
    it('case 3', () => {
      const array = [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }, { a: 5 }]
      expect(removeItem(array, { a: 2 }, (a, b) => a.findIndex(({ a: _ }) => b.a === _))).toStrictEqual([
        { a: 1 },
        { a: 3 },
        { a: 4 },
        { a: 5 },
      ])
    })
  })
})
