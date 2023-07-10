import type { message } from 'js-md5'
import md5 from 'js-md5'

const _crypto = async (data: ArrayBuffer, algorithm = 'SHA-1') => {
  return await crypto.subtle.digest(algorithm, data)
}

const buffer2str = (buffer: ArrayBuffer) => {
  const hashArray = Array.from(new Uint8Array(buffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}

/**
 * md5加密
 *
 * 参考库：js-spark-md5/js-md5
 * @param text
 * @returns
 */
export const sha1 = async (text: string, returnBuffer = false) => {
  if (!text) throw new TypeError(`${text} can not be null`)
  if (!TextEncoder) throw new Error('your browser not support TextEncoder')
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const buffer = await _crypto(data)

  return returnBuffer ? buffer : buffer2str(buffer)
}

/**
 *
 * hash file
 *
 * @param file
 * @param returnBuffer
 * @returns
 */
export const sha256 = async (file: Blob, returnBuffer = false) => {
  if (!file) throw new TypeError(`${file} can not be null`)
  const data = await _crypto(await file.arrayBuffer(), 'SHA-256')
  return returnBuffer ? data : buffer2str(data)
}

export const md5_ = (text: message) => {
  return md5(text)
}
