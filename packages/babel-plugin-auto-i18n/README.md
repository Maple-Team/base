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

### access i18n in dom

```js
const elements = document.querySelectorAll('[data-i18n]')
const i18nValues = Array.from(elements).map((el) => JSON.parse(el.getAttribute('data-i18n')))
const totalI18nKeys = Array.prototype.concat.apply([], i18nValues)
const uniqiqI18nKeys = [...new Set(totalI18nKeys)]
console.log(uniqiqI18nKeys)
```

## TODO

### 1.0

- [x] 支持 jsxText 内的文本转换
- [x] 支持 stringLiteral 内的文本转换
- [x] 支持 templateElement 内的文本转换
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
- [ ] jsxText/jsxAttribute/jsxExpressionContainer 下的 stringLiteral 注入 data-i18n 属性
  - [x] jsxText
  - [ ] jsxExpressionContainer
  - [ ] jsxAttribute
  - [x] jsxAttribute 注入是否 react render 时会被保留 -> 组件框架或自定义组件处理
  - [x] jsxAttribute 其他属性也需要加入到`data-i18n`属性上
- [x] jsxText
- [ ] templateLiteral
- [ ] jsx 其他的键绑定到根元素的 dom 上

### ideas

- [ ] templateLiteral 不影响现有的手动处理的`t('xx', {count;'xxx'})` 之类的
- [ ] bench the performance of this plugin
- [ ] support class component
- [ ] support option source language
- [ ] 删除冗余的导入
- [ ] 其他节点的处理方式呢？
  - 比如 message.info('xx'), 函数改写再注入？
