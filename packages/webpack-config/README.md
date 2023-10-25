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
// 可以console输出合并后的配置信息
```

## 关键点

### 内置 plugins

- ContextReplacementPlugin
- DefinePlugin
- OptimizeCSSAssetsPlugin

### tree-shaking

### HMR

### optimization

### assets handle

#### css

#### less

#### svg 的处理方式

```tsx
import IconParking from './icon-parking.svg'

export const IconWrap = () => {
  return (
    <div>
      <IconParking />
    </div>
  )
}
```

### 可拓展

#### babel 拓展

#### postcss-loader

### dll

## Reference

- [create-react-app](https://www.npmjs.com/package/create-react-app)
- [vue-cli](https://www.npmjs.com/package/@vue/cli-service)
- [How To Integrate SVG For Website And React App With Webpack](https://dev.to/antoineamara/how-to-integrate-svg-for-website-and-react-app-with-webpack-3bfb)
- [How to use SVGs in React](https://blog.logrocket.com/how-to-use-svgs-react/#use-svgs-react)
- [How to Use the SVG Symbol and React to Create Custom Icons](https://javascript.plainenglish.io/using-svg-symbol-to-custom-react-icon-cacf8c41af1)
- [svgo-loader](https://github.com/svg/svgo-loader)
- [svgr](https://github.com/gregberge/svgr)
- [webpack-merge](https://github.com/survivejs/webpack-merge)
