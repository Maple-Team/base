const path = require('path')

module.exports = {
  title: '@liutsing/vue-components',
  description: 'Just playing around.',
  themeConfig: {
    repo: '',
    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'What is @liutsing/vue-components?', link: '/' },
          { text: 'Getting Started', link: '/guide/' },
        ],
      },
      {
        text: 'Components',
        items: [{ text: 'Component A', link: '/components/component-a' }],
      },
    ],
  },
  vite: {
    resolve: {
      alias: {
        '@liutsing/vue-components': path.resolve(__dirname, '../../dist'),
      },
      dedupe: ['vue'], // avoid error when using dependencies that also use Vue
    },
  },
}
