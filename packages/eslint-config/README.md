# `@liutsing/eslint-config`

> eslint config used by `TypeScript` app of MapleImage

## Usage

```bash
npm install @liutsing/eslint-config -D
```
### TypeScript project
1. Create a `.eslintrc.js` configuration file in the root of your project with the following content:

```js
module.exports = {
  extends: '@liutsing/eslint-config',
}
```
2. Run eslint on all the ts files etc in your project:
```bash
npx eslint . --ext .ts
```
### Vue3 + TypeScript projects
1. Create a `.eslintrc.cjs` configuration file in the root of your project with the following content:

```js
module.exports = {
  extends: '@liutsing/eslint-config',
}
```
2. Run eslint on all the SCSS files etc in your project:
```bash
npx eslint . --ext .ts
```
