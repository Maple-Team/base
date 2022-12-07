# @liutsing/pattern-logger-loader

测试 webpack module test pattern 规则的 loader

## install

```sh
npm install @liutsing/pattern-logger-loader --save-dev
pnpm install @liutsing/pattern-logger-loader --save-dev
yarn add @liutsing/pattern-logger-loader -D
```

## usage

```js
{
  modules: {
    rules: [
      {
        test: /(j|t)sx?/,
        use: ['babel-loader', '@liutsing/pattern-logger-loader'],
      },
    ]
  }
}
```

## Resources

[writing-custom-webpack-loader](https://redd.one/blog/writing-custom-webpack-loader)，编写一个自定义 `webpack` `loader`
[writing-a-loader](https://webpack.js.org/contribute/writing-a-loader/), `webpack` 编写 `loader` 的文档
[ts-loader/](https://github.com/TypeStrong/ts-loader/blob/5e7220b65bd4e2709a76c9386cb939cdfed32eca/src/index.ts#L176), `webpack` loader 类型定义参考
[vue-loader](https://github.com/vuejs/vue-loader/blob/next/src/index.ts), `webpack` loader 类型定义参考
