# @liutsing/microbundle

A small Rollup-powered library bundler inspired by `microbundle`.

It builds TypeScript or JavaScript library entry points to ESM, CommonJS, and IIFE outputs. Each format is emitted as readable and minified files by default, with sourcemaps and TypeScript declarations.

```sh
microbundle src/index.ts --format es,cjs,iife --name MyLibrary
```

Default outputs:

- `dist/index.mjs`
- `dist/index.min.mjs`
- `dist/index.js`
- `dist/index.min.js`
- `dist/index.iife.js`
- `dist/index.iife.min.js`
- `types/index.d.ts`

The bundler uses the consuming project's local `typescript` package when available. Dependencies, peer dependencies, optional dependencies, Node built-ins, and values passed through `--external` are treated as Rollup externals.
