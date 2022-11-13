## `withDefaults`

One drawback of the type-only defineProps declaration is that it doesn't have a way to provide default values for the props. **To resolve this problem, a `withDefaults` compiler macro is also provided**:

```ts
export interface Props {
  msg?: string
  labels?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  msg: 'hello',
  labels: () => ['one', 'two'],
})
```

This will be compiled to equivalent runtime props `default` options. In addition, the `withDefaults` helper provides type checks for the `default` values, and ensures the returned `props` type has the optional flags removed for properties that do have default values declared.

[links](https://vuejs.org/api/sfc-script-setup.html#default-props-values-when-using-type-declaration)
