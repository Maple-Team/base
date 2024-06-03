import type * as Buffer from 'buffer'

describe('binary manualation learning cases', () => {
  describe('TextDecoder test cases', () => {
    it('case 1', () => {
      const utf8Decoder = new TextDecoder() // default 'utf-8' or 'utf8'
      // 超过ASCII编码范围的就都需要使用多字节编码
      // 需要多字节编码  𠮷 占4个字节
      const u8arr = new Uint8Array([240, 160, 174, 183])
      const i8arr = new Int8Array([-16, -96, -82, -73])
      const u16arr = new Uint16Array([41200, 47022])
      const i16arr = new Int16Array([-24336, -18514])
      const i32arr = new Int32Array([-1213292304])

      expect(utf8Decoder.decode(u8arr)).toEqual('𠮷')
      expect(utf8Decoder.decode(i8arr)).toEqual('𠮷')
      expect(utf8Decoder.decode(u16arr)).toEqual('𠮷')
      expect(utf8Decoder.decode(i16arr)).toEqual('𠮷')
      expect(utf8Decoder.decode(i32arr)).toEqual('𠮷')
    })
  })
  describe('TextEncoder test cases', () => {
    it('case 1', () => {
      const utf8Encoder = new TextEncoder()
      expect(utf8Encoder.encode('𠮷').toString()).toEqual('240,160,174,183')
      // console.log(utf8Encoder.encode('ab')) // Uint8Array(2) [ 97, 98 ]
    })
  })
  describe('TypedArray test cases', () => {
    it('case 1', () => {
      // 假设我们有以下 Uint8Array
      const u8arr = new Uint8Array([240, 160, 174, 183])
      const length = u8arr.length
      // 计算新的 ArrayBuffer 大小
      const buffer = new ArrayBuffer(length)

      // 创建 Uint16Array 并复制数据
      const uint16Array = new Uint16Array(buffer)
      /**
       *
       在讨论字节序（endianness）时，通常有两种顺序：大端序（Big Endian）和小端序（Little Endian）。

大端序：高位字节在前，低位字节在后。也就是说，如果一个16位的值是 0xABCD，那么在大端序中，0xAB 是高位字节，会存储在较低的内存地址上，而 0xCD 是低位字节，会存储在较高的内存地址上。
小端序：低位字节在前，高位字节在后。在小端序中，0xCD 会存储在较低的内存地址上，而 0xAB 会存储在较高的内存地址上。
       */
      for (let i = 0; i < length; i++) {
        // 将 Uint8Array 中的每个字节转换为 16 位整数
        // 这里简单地将每个字节作为一个单独的 16 位块
        // 注意：这只是一个示例，实际转换逻辑可能需要根据具体需求来设计
        // NOTE 之前一个槽放8个元素，现在一个槽放16个元素
        // 按位或操作符（|）将第i个元素的值与（已左移8位的）第i+1个元素的值进行按位或操作。
        // 由于第i+1个元素的值已经在更高8位上，这个操作将两个8位的值合并成一个16位的值。
        // const el = u8arr[i] | (u8arr[++i] << 8)
        // console.log(el) // 41200 47200
        uint16Array[i / 2] = u8arr[i] | (u8arr[++i] << 8)
      }

      expect(uint16Array).toEqual(new Uint16Array([41200, 47022]))
    })
    it('case 2', () => {
      const encoder = new TextEncoder()
      const text = '你好'
      const utf8 = encoder.encode('你好')
      // console.log(utf8) //  Uint8Array(6) [ 228, 189, 160, 229, 165, 189 ]

      // NOTE 需要明确buffer的编码
      const utf8Text = new TextDecoder().decode(utf8)
      expect(utf8Text).toBe(text)

      // https://github.com/ashtuchkin/iconv-lite/blob/master/lib/index.js
      const iconv = require('iconv-lite')

      // 使用iconv-lite进行GBK编码
      const gbk: Buffer = iconv.encode(text, 'gbk')
      // console.log(gbk)
      // buffer <----> uint8array
      const uint8Array = new Uint8Array(gbk)
      // console.log(uint8Array) // Uint8Array(4) [ 196, 227, 186, 195 ]
      // NOTE 需要明确buffer的编码
      const gbkTet = new TextDecoder('gbk').decode(uint8Array)
      expect(gbkTet).toBe(text)
    })
  })
})
