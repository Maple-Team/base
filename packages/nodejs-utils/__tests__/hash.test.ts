import { Buffer } from 'buffer'
import { base64ToBuffer } from '../src'

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
})
