const meta = {
  _: {
    name: 'viewport',
    content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
  },
  a: {
    'http-Equiv': 'Content-Type',
    content: 'text/html; charset=utf-8',
  },
  b: {
    'http-equiv': 'X-UA-Compatible',
    content: 'IE=edge',
  },
  c: {
    'http-equiv': 'expires',
    content: 'Wed, 26 Feb 1997 08:21:57 GMT',
  },
  d: {
    'http-equiv': 'pragma',
    content: 'no-cache',
  },
  e: {
    'http-equiv': 'Cache-Control',
    content: 'no-store, must-revalidate',
  },
  f: {
    name: 'Build Date',
    content: new Date().toLocaleString(),
  },
}

module.exports = { meta }
