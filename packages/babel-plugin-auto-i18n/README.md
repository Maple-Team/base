# @liutsing/babel-plugin-auto-i18n

## function

auto transform chinese string to `t` invoke expression

## usge

in babel config file like `.babelrc`,

```json
{
  "plugins": [["@liutsing/babel-plugin-auto-i18n"]]
}
```

## Misc

### [Plugin Ordering](https://babeljs.io/docs/en/plugins#plugin-ordering)

> Ordering matters for each visitor in the plugin.

This means if two transforms both visit the "Program" node, the transforms will run in either plugin or preset order.

- **Plugins run before Presets**.
- **Plugin ordering is first to last**.
- **Preset ordering is reversed** (last to first).

## TODO

### 1.0

- [ ] Avoid unnecessary calls to the `useTranslation` function.
- [ ] unnecessary import will be tree-shaking by webpack -> need test
- [ ] bench the performance of this plugin

### 2.0

- [ ] support option source language
