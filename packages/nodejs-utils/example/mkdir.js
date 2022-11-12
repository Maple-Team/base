const { mkdirSafeSync, mkdirSafe } = require('../')

mkdirSafeSync('a/b/c', { recursive: true })

mkdirSafe('b/c/d', { recursive: true }).then(console.log)
