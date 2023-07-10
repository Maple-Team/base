import crypto from 'crypto'
import { TextEncoder } from 'util'

global.TextEncoder = TextEncoder

Object.defineProperty(global.self, 'crypto', {
  value: {
    subtle: crypto.webcrypto.subtle,
    randomUUID: crypto.randomUUID,
  },
})
