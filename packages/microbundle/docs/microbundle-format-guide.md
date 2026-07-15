# Microbundle Format Guide

`@liutsing/microbundle` treats these as the real output formats:

- `es`
- `cjs`
- `umd`

`iife` is accepted only as a legacy alias and is normalized to `umd`.

## What each format means

### `es`

ES Module output. Best for downstream bundlers and tree shaking.

### `cjs`

CommonJS output. Best for `require()` and older Node consumers.

### `umd`

Universal Module Definition output. It works in CommonJS, AMD, and browser-global environments.

## UMD vs IIFE

They are related but not the same.

- `iife` is just a self-executing browser-global bundle.
- `umd` wraps that idea in extra compatibility for AMD and CommonJS.

So `umd` is the broader format, and `iife` is the narrower one.

## This repo's rule

- The supported formats are `es / cjs / umd`
- `iife` is accepted for compatibility, but it is rewritten to `umd`
- Output files use the `.umd.js` naming convention

## Result

If you want a small library bundler with modern package support, tree shaking, and direct browser usage, `es + cjs + umd` is the right set here.
