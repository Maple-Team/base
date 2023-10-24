# @liutsing/font-minify-plugin

根据传入的汉字文字或其他字体支持的符号，生成对应的简化字体资源并集成到 webpack 打包资源中

## Getting Started

To begin, you'll need to install `@liutsing/font-minify-plugin`:

```sh
npm install @liutsing/font-minify-plugin --save-dev
```

or

```sh
yarn add -D @liutsing/font-minify-plugin
```

or

```sh
pnpm add -D @liutsing/font-minify-plugin
```

Then add the plugin to your webpack config. For example:

webpack.config.js

```js
const FontMinifyPlugin = require('@liutsing/font-minify-plugin')
module.exports = {
  // 额外的webpack配置
  plugins: [
    new FontMinifyPlugin({
      words: '待生成webFont的文字文件路径',
    }),
  ],
}
```

> 建议与[`@liutsing/babel-plugin-extract-used-chinese`]()搭配使用

.babelrc

```json
{
  // ...其他babel配置
  "plugins": [
    // ...其他babel插件
    [
      "@liutsing/babel-plugin-extract-used-chinese",
      {
        "filename": "<收集到的汉字存储文件名>"
      }
    ]
  ]
}
```

## Options

### words

Type:

```ts
type words = string
```

待生成简化字体的文字，可以是一个文件路径或者文字内容，为文字内容时，`isFilePath`必须为`false`

```js
module.exports = {
  // 额外的webpack配置
  plugins: [
    new FontMinifyPlugin({
      words: '测试字体',
      isFilePath: false,
    }),
  ],
}
```

或

```js
module.exports = {
  // 额外的webpack配置
  plugins: [
    new FontMinifyPlugin({
      words: path.resolve(os.tmpdir(), 'example-webpack-react.txt'),
    }),
  ],
}
```

### isFilePath

Type:

```ts
type isFilePath = boolean
```

Default: `true`

传入的文字资源是否为文件路径

### fontSource

Type:

```ts
type fontSource = string
```

Default: `path.resolve(__dirname, './puhui2/AlibabaPuHuiTi_2_55_Regular.ttf')`

原始的 ttf 字体路径

### fontDistDirectory

Type:

```ts
type fontDistDirectory = string
```

Default: `path.resolve(cwd, './public/fonts')`

webFont 字体目录

### fontDistFilename

Type:

```ts
type fontDistFilename = string
```

Default: `AlibabaPuHuiTi_2_55_Regular`

webFont 字体文件名

### fontExts

Type:

```ts
type fontExts = string[]
```

Default: `['woff2', 'woff']`

webFont 字体文件后缀，默认 `woff2`/`woff` 都生成

### additionalSymbols

Type:

```ts
type additionalSymbols = string[]
```

Default: `[]`

原始 ttf 支持的额外所需的文字符号，补充文字符号
