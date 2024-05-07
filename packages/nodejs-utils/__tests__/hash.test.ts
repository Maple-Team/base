import { Buffer } from 'buffer'
import { base64ToBuffer } from '../src'

const iter = (arr: NodeJS.TypedArray) => {
  for (let index = 0; index < arr.length; index++) {
    const element = arr[index]
    console.log(element)
  }
}

describe('hash tests', () => {
  it('base64 to buffer', () => {
    const base64Data =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABAAAAAQACAIAAADwf7zUAAAACXBIWXMAABYlAAAWJQFJUiTwAACN1klEQVR4nOzddXxWdf/'
    const base64Image = base64Data.split(';base64,').pop()
    if (!base64Image) return
    const binaryData = base64ToBuffer(base64Image)

    const expectBuffer = Buffer.from(base64Image, 'base64')
    expect(binaryData).toStrictEqual(expectBuffer)
  })
  it('test Buffer', () => {
    const buffer1 = new Uint8Array([255, 256])
    iter(buffer1) // 255, 0
    const buffer2 = new Uint8Array([-1, 255, 256])
    iter(buffer2) // 255, 255, 0
    const buffer3 = new Uint16Array([65535, 65536])
    iter(buffer3) // 65535, 0
  })
  it('test Buffer', () => {
    // 创建一个ArrayBuffer，长度为16字节
    const buffer = new ArrayBuffer(16)

    // 创建一个Uint8Array视图，用于操作ArrayBuffer中的数据
    const view8 = new Uint8Array(buffer)

    // 创建一个DataView视图，用于更为底层和灵活的数据操作
    const view = new DataView(buffer)

    // 通过Uint8Array设置一些数据
    for (let i = 0; i < view8.length; i++) view8[i] = i

    // 使用DataView读取8位无符号整数
    for (let i = 0; i < view8.length; i++) console.log(view.getUint8(i)) // 输出从0到15

    // 使用DataView设置一个32位浮点数
    view.setFloat32(4, 3.14159, true) // true 表示小端序

    // 使用DataView读取32位浮点数
    console.log(view.getFloat32(4, true)) // 输出：3.14159

    // iter(view)
  })
})
