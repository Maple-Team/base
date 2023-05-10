# @liutsing/rollup-plugin-write-css

将 rollup 打包的产物中的`index.css`提取到`dist`下，而不是对应的`dist/<formate>下`

## install

```sh
npm install @liutsing/rollup-plugin-write-css --save-dev
pnpm install @liutsing/rollup-plugin-write-css --save-dev
yarn add @liutsing/rollup-plugin-write-css -D
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
