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

## Minification

Minified files are generated with `@rollup/plugin-terser` only for `.min.*` outputs.
Readable outputs are written without terser.

Current terser call:

```ts
terser()
```

This means `@liutsing/microbundle` does not currently pass custom terser options
such as `drop_console`, `passes`, `ecma`, `keep_fnames`, or property mangling.

The effective defaults are:

- `@rollup/plugin-terser` enables `sourceMap` when Rollup sourcemaps are enabled.
- `@rollup/plugin-terser` passes `module: true` for ES output.
- `@rollup/plugin-terser` passes `toplevel: true` for CJS output.
- UMD output uses Terser defaults plus sourcemap handling.
- Terser enables compression and identifier mangling by default.
- Terser does not mangle object property names by default.
- Terser does not drop `console.*` by default.
- Terser `compress.passes` defaults to `1`.
- Terser `compress.unsafe` defaults to `false`.

Use `--no-minify` or `--no-compress` to skip `.min.*` outputs.
