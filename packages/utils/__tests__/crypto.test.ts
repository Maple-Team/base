import { md5_ as md5, sha1 } from '@/crypto'

describe('crypto test', () => {
  describe('sha1', () => {
    // @https://10015.io/tools/sha1-encrypt-decrypt
    it.concurrent.each([
      ['123', '40bd001563085fc35165329ea1ff5c5ecbdbbeef'],
      ['1', '356a192b7913b04c54574d18c28d46e6395428ab'],
      ['abc', 'a9993e364706816aba3e25717850c26c9cd0d89d'],
      ['www.baidu.com', '31e50a13cdfa1bc2a6a0c2a31b74e3340b7a2dbc'],
    ])("%s 's sha1 hash result should be %s", async (input, hash) => {
      const res = await sha1(input)
      expect(res).toBe(hash)
    })
  })
  describe('md5', () => {
    it('case 1', () => {
      expect(md5('123')).toBe('202cb962ac59075b964b07152d234b70')
    })
  })
})
