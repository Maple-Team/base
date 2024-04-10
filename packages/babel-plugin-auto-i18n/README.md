# @liutsing/babel-plugin-auto-i18n

## function

auto transform chinese string to `t` invoke expression

## usage

in babel config file like `.babelrc`,

```json
{
  "plugins": [["@liutsing/babel-plugin-auto-i18n"]]
}
```

## TODO

### 1.0
- [x] 支持jsxText内的文本转换
- [x] 支持stringLiteral内的文本转换
- [x] 支持templateElement内的文本转换
- [ ] 支持objectMethod内的文本转换
- [ ] 支持templateLiteral的文本，单复数/文本插槽功能
- [x] Avoid unnecessary calls to the `useTranslation` function.
- [x] unnecessary import will be tree-shaking by webpack
  - ```js
      optimization: {
        sideEffects: false,
      }
    ```
- [ ] bench the performance of this plugin
- [ ] 多个plugins，含同样的节点遍历逻辑，测试访问顺序
### 2.0

- [ ] support option source language
