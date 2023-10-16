const { base } = require('@liutsing/webpack-config')
const { merge } = require('webpack-merge')
const TestPlugin = require('../plugins/testPlugin')

module.exports = merge(base, {
  experiments: {
    lazyCompilation: false,
  },
  plugins: [new TestPlugin()],
})
