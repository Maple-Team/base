# @liutsing/babel-plugin-remove-console

## function

remove the `console code` of source code, and support option to exclude some sub property for production debug, for example: `console.debug`, `console.warn`

## usge

in babel config file like `.babelrc`,

```json
{
  "plugins": [
    [
      "@liutsing/babel-plugin-remove-console",
      {
        "exclude": ["debug", "error", "warn"]
      }
    ]
  ]
}
```

## more

### [Plugin Ordering](https://babeljs.io/docs/en/plugins#plugin-ordering)

> Ordering matters for each visitor in the plugin.

This means if two transforms both visit the "Program" node, the transforms will run in either plugin or preset order.

- **Plugins run before Presets**.
- **Plugin ordering is first to last**.
- **Preset ordering is reversed** (last to first).
