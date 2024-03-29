import * as crypto from 'crypto'
import * as fs from 'fs'
import { Buffer } from 'buffer'

// @https://blog.shevlyagin.com/2021/10/28/fastest-node-js-hashing-algorithm-for-large-strings/
const BUFFER_SIZE = 8192
export type HashAlgorithm = 'sha256' | 'sha1' | 'md5'

export function md5FileSync(path: fs.PathLike) {
  const fd = fs.openSync(path, 'r')
  const hash = crypto.createHash('md5')
  const buffer = Buffer.alloc(BUFFER_SIZE)

  try {
    let bytesRead

    do {
      bytesRead = fs.readSync(fd, buffer, 0, BUFFER_SIZE, 0)
      hash.update(buffer.slice(0, bytesRead))
    } while (bytesRead === BUFFER_SIZE)
  } finally {
    fs.closeSync(fd)
  }

  return hash.digest('hex')
}

export function md5File(path: fs.PathLike) {
  return new Promise((resolve, reject) => {
    const output = crypto.createHash('md5')
    const input = fs.createReadStream(path)

    input.on('error', (err) => {
      reject(err)
    })

    output.once('readable', () => {
      resolve(output.read().toString('hex'))
    })

    input.pipe(output)
  })
}

export function hashFile(path: fs.PathLike, algo: HashAlgorithm) {
  const hash = crypto.createHash
  return new Promise<String>((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) reject(err)

      resolve(hash(algo).update(data).digest('base64'))
    })
  })
}
export function hashFileSync(path: fs.PathLike, algo: HashAlgorithm) {
  const hash = crypto.createHash
  const content = fs.readFileSync(path)
  return hash(algo).update(content).digest('base64')
}
