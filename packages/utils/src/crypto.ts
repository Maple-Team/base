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

  // 增加全局对象存在性判断
  const globalObj =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof window !== 'undefined'
      ? window
      : typeof self !== 'undefined'
      ? self
      : {}

  if (!('TextEncoder' in globalObj))
    throw new Error('your browser not support TextEncoder or this method[sha1] not support in nodejs')

  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const b = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength)
  // 尤其是在浏览器环境中，可能不会遇到SharedArrayBuffer，除非特别使用了多线程（如Web Worker）。但为了代码的健壮性，需要处理这种情况。
  let safeBuffer

  if (typeof SharedArrayBuffer === 'undefined') {
    safeBuffer = b
  } else {
    if (b instanceof SharedArrayBuffer) safeBuffer = new Uint8Array(b).slice().buffer
    else safeBuffer = b
  }

  const buffer = await _crypto(safeBuffer as ArrayBuffer, 'SHA-1')

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
