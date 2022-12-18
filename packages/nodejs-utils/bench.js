const Benchmark = require('benchmark')
const suite = new Benchmark.Suite()
const hash = require('crypto').createHash
const blake2 = require('blake2')
const scenarios = [
  { alg: 'blake2', digest: 'base64' },
  { alg: 'blake2', digest: 'hex' },
  { alg: 'md5', digest: 'hex' },
  { alg: 'md5', digest: 'base64' },
  { alg: 'sha1', digest: 'hex' },
  { alg: 'sha1', digest: 'base64' },
  { alg: 'sha256', digest: 'hex' },
  { alg: 'sha256', digest: 'base64' },
]

const fs = require('fs')

fs.readFile('./hash.js', 'utf8', (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  const bufferData = Buffer.from(data)
  for (const { alg, digest } of scenarios) {
    suite.add(`${alg}-${digest}`, () => {
      if (alg === 'blake2') {
        blake2.createHash('blake2b', { digestLength: 16 }).update(bufferData).digest().toString(digest)
      } else {
        hash(alg).update(data).digest(digest)
      }
    })
  }
  suite
    .on('cycle', function (event) {
      console.log(String(event.target))
    })
    .on('complete', function () {
      console.log('Fastest is ' + this.filter('fastest').map('name'))
    })
    .run()
})
