# @liutsing/html-webpack-plugin

测试 webpack module test pattern 规则的 loader

## install

```sh
npm install @liutsing/html-webpack-plugin --save-dev
pnpm install @liutsing/html-webpack-plugin --save-dev
yarn add @liutsing/html-webpack-plugin -D
```

## usage

```js
const MapleHtmlWebpackPlugin = require('@liutsing/html-webpack-plugin')

const configs = {
  plugins: [new MapleHtmlWebpackPlugin({ options: '' })],
}
```

## Resources

[html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin)

## Learning Ideas

> TODO 理解`html-webpack-plugin`提供出来的钩子函数的处理时机，能用来做什么事情

![html-webpack-plugin flow时序图](./flow.png)

### `beforeAssetTagGeneration` hook

```
    AsyncSeriesWaterfallHook<{
      assets: {
        publicPath: string,
        js: Array<{string}>,
        css: Array<{string}>,
        favicon?: string | undefined,
        manifest?: string | undefined
      },
      outputName: string,
      plugin: HtmlWebpackPlugin
    }>
```

### `alterAssetTags` hook

```
    AsyncSeriesWaterfallHook<{
      assetTags: {
        scripts: Array<HtmlTagObject>,
        styles: Array<HtmlTagObject>,
        meta: Array<HtmlTagObject>,
      },
      publicPath: string,
      outputName: string,
      plugin: HtmlWebpackPlugin
    }>
```

### `alterAssetTagGroups` hook

```
    AsyncSeriesWaterfallHook<{
      headTags: Array<HtmlTagObject | HtmlTagObject>,
      bodyTags: Array<HtmlTagObject | HtmlTagObject>,
      publicPath: string,
      outputName: string,
      plugin: HtmlWebpackPlugin
    }>
```

### `afterTemplateExecution` hook

```
    AsyncSeriesWaterfallHook<{
      html: string,
      headTags: Array<HtmlTagObject | HtmlTagObject>,
      bodyTags: Array<HtmlTagObject | HtmlTagObject>,
      outputName: string,
      plugin: HtmlWebpackPlugin,
    }>
```

### `beforeEmit` hook

```
    AsyncSeriesWaterfallHook<{
      html: string,
      outputName: string,
      plugin: HtmlWebpackPlugin,
    }>
```

### `afterEmit` hook

```
    AsyncSeriesWaterfallHook<{
      outputName: string,
      plugin: HtmlWebpackPlugin
    }>
```

## build

### with babel

### with rollup

```sh
"build": "rollup -c rollup.config.js"
```

rollup.config.js:

```js
const typescript = require('@rollup/plugin-typescript')
// https://rollupjs.org/javascript-api/#outputoptions-object

/**
 * @type {import('rollup').RollupOptions}
 *
 */
module.exports = {
  input: 'src/index.ts',
  output: [
    {
      file: 'lib/index.js',
      format: 'cjs',
      sourcemap: false,
    },
    {
      file: 'lib/index.mjs',
      format: 'es',
      sourcemap: false,
    },
  ],
  plugins: [
    typescript({
      tsconfig: './tsconfig.build.json',
    }),
  ],
}
```

## TODO

nodejs 库打包产物问题
