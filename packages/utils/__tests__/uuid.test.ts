import { uuid } from '@/uuid'

describe('uuid test cases', () => {
  describe('uuid with length', () => {
    it('case 1', () => {
      expect(uuid(10).length).toBe(10)
    })
  })
  describe('uuid without length', () => {
    it('case 1', () => {
      expect(uuid().length).toBe(36)
    })
  })
})
