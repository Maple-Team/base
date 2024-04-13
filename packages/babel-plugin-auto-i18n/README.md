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

- [x] 支持 jsxText 内的文本转换
- [x] 支持 stringLiteral 内的文本转换
- [x] 支持 templateElement 内的文本转换
- [ ] 支持 objectMethod 内的文本转换
- [x] Avoid unnecessary calls to the `useTranslation` function.
- [x] unnecessary import will be tree-shaking by webpack
  - ```js
      optimization: {
        sideEffects: false,
      }
    ```
- [x] 多个 plugins，含同样的节点遍历逻辑，测试访问顺序
- [x] i18n-ignore comments
- [x] 支持 templateLiteral 的文本，文本插槽功能

### todos
- [ ] templateLiterral不影响现有的手动处理的`t('xx', {count;'xxx'})` 之类的
- [ ] bench the performance of this plugin
- [ ] support class component
- [ ] support option source language
- [ ] 删除冗余的导入

