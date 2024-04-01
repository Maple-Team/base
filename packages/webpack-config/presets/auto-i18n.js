const plugin = require('@liutsing/babel-plugin-auto-i18n')

module.exports = function () {
  return {
    plugins: [
      [
        '@liutsing/babel-plugin-auto-i18n',
        {
          hashFn: plugin.transformKey,
        },
      ],
    ],
  }
}
