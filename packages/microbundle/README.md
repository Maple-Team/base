# @liutsing/microbundle

A small Rollup-powered library bundler inspired by `microbundle`.

It builds TypeScript or JavaScript library entry points to ESM, CommonJS, and UMD outputs. Each format is emitted as readable and minified files by default, with sourcemaps and TypeScript declarations.

```sh
microbundle src/index.ts --format es,cjs,umd --name MyLibrary
```

Default outputs:

- `dist/index.mjs`
- `dist/index.min.mjs`
- `dist/index.js`
- `dist/index.min.js`
- `dist/index.umd.js`
- `dist/index.umd.min.js`
- `types/index.d.ts`

The bundler uses the consuming project's local `typescript` package when available. Dependencies, peer dependencies, optional dependencies, Node built-ins, and values passed through `--external` are treated as Rollup externals.
