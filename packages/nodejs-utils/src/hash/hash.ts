import * as crypto from 'crypto'
import * as fs from 'fs'
import { Buffer } from 'buffer'

// @https://blog.shevlyagin.com/2021/10/28/fastest-node-js-hashing-algorithm-for-large-strings/
export type HashAlgorithm = 'sha256' | 'sha1' | 'md5'
export function hash(str: string | NodeJS.ArrayBufferView, algo: HashAlgorithm = 'sha1') {
  const hash = crypto.createHash
  return hash(algo).update(str).digest('base64')
}

export function hashFile(path: fs.PathLike, algo: HashAlgorithm) {
  return new Promise<String>((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) reject(err)
      resolve(hash(data, algo))
    })
  })
}
export function hashFileSync(path: fs.PathLike, algo: HashAlgorithm) {
  const content = fs.readFileSync(path)
  return hash(content, algo)
}

/**
 * base64转buffer
 * @param base64
 * @returns
 */
export const base64ToBuffer = (base64: string): Buffer => {
  // The btoa() method creates a Base64-encoded ASCII string from a binary string (i.e., a string in which each character in the string is treated as a byte of binary data).
  // The atob() function decodes a string of data which has been encoded using Base64 encoding. You can use the btoa() method to encode and transmit data which may otherwise cause communication problems, then transmit it and use the atob() method to decode the data again. For example, you can encode, transmit, and decode control characters such as ASCII values 0 through 31.

  // method1
  const binnaryString = atob(base64)
  const len = binnaryString.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) bytes[i] = binnaryString.charCodeAt(i)
  return Buffer.from(bytes)
  // return Buffer.copyBytesFrom(bytes)
  // method2
  // return Buffer.from(base64, 'base64')
}
