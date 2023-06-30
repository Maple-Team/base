# @liutsing/rollup-plugin-extract-style

将 rollup 打包的产物中的`index.css`提取到`dist`下，而不是对应的`dist/<formate>下`

## install

```sh
npm install @liutsing/rollup-plugin-extract-style --save-dev
pnpm install @liutsing/rollup-plugin-extract-style --save-dev
yarn add @liutsing/rollup-plugin-extract-style -D
```

## usage

```js
// rollup.config.js
{
   plugins: [
      writeCss(),
    ],
}
```

## Resources

- [rollup plugin development](https://rollupjs.org/plugin-development)
