import { md5_ as md5, sha1 } from '@/crypto'

describe('crypto test', () => {
  describe('sha1', () => {
    it('case 1', async () => {
      const hash = await sha1('123')
      expect(hash).toBe('40bd001563085fc35165329ea1ff5c5ecbdbbeef')
    })
  })
  describe('md5', () => {
    it('case 1', () => {
      expect(md5('123')).toBe('202cb962ac59075b964b07152d234b70')
    })
  })
})
