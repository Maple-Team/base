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

  it('should convert a valid base64 string to buffer', () => {
    // Define the base64 string
    const base64 = 'VGhhbmsgeW91IGZvciB0aGUgc3VwcG9ydC4='

    // Convert the base64 string to buffer
    const buffer = base64ToBuffer(base64)

    // Define the expected buffer
    const expectedBuffer = Buffer.from('Thanks for the support.', 'utf-8')

    // Assert that the converted buffer equals the expected buffer
    expect(buffer).toEqual(expectedBuffer)
  })

  // Test case 2: invalid base64 string
  it('should throw an error if the base64 string is invalid', () => {
    // Define the invalid base64 string
    const base64 = 'Invalid Base64 String'

    // Assert that an error is thrown when converting the invalid base64 string
    expect(() => {
      base64ToBuffer(base64)
    }).toThrow()
  })
})
