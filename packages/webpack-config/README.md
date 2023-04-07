# webpack config lib

## target

- 避免反复配置 `webpack` 时可能的配置遗漏导致 `webpack` 运行不如预期
- 抽取常用的配置项，如**优化**等

## 使用

### dev

```js
// webpack.dev.js
const { dev } = require('@liutsing/webpack-config')

module.exports = dev
// package.json/script
// cross-env <> webpack serve --config config/webpack.dev.js
```

### prod

```js
// webpack.dev.js
const { dev } = require('@liutsing/webpack-config')

module.exports = dev
// package.json/script
// cross-env <> webpack serve --config config/webpack.dev.js
```

### extend

```js
// webpack.dev.js
const { dev, base } = require('@liutsing/webpack-config')
const { merge } = require('webpack-merge')

// extend which preset config if you need
module.exports = merge(base, {
  // your custom config
})
```
