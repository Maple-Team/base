# Vite + TypeScript to build your Vue Component

构建组件的两种方式

> vue 依赖处理为外部依赖

- 依赖构建，基于 `rollup`(常用)
  - 产物：`js`文件(`umd` + `esm`) + `css`样式文件(可选，如果有的话)
- 不依赖构建，组件以`.vue`文件分发

## 配置

- 配置 `tsconfig`，处理 `vue` 文件类型等

  - `tsconfig.app.json`
  - `tsconfig.config.json`
  - `tsconfig.json`
  - `tsconfig.types.json`

- 配置 `vite`，处理 `build` 配置
  - `vue` 文件
  - 样式文件

## 源码编写

放在 `src` 下面，与平常项目中的库一样的导出方式

## 示例 debug

基于 `vite` 的话，sandbox/example 下像正常组件一样引入使用

不用怎么配置，直接使用`<script type="module" src="./sandbox/main.ts" />`

## 打包脚本

### scripts

- -> js + css
- 组件类型导出
- 类型检查

### 脚本发布配置

- `main`
- `types`
- `module`
- `files`
- `exports`: The `"exports"` field is used to restrict external access to non-exported module files, also enables a module to import itself using `"name"`.

### Note

> If the `package.json` does not contain `"type": "module"`, Vite will generate different file extensions for Node.js compatibility. `.js` will become `.mjs` and `.cjs` will become `.js`.

### Environment Variables

> In library mode, all `import.meta.env.*` usage are statically replaced when building for production. However, `process.env.*` usage are not, so that consumers of your library can dynamically change it. If this is undesirable, you can use `define: { 'process.env.NODE_ENV': '"production"' }` for example to statically replace them.

// TODO

- [ ] unit-tests with `Vitest`
- [ ] component-testing with `Cypress`
- [ ] component docs
- [ ] 主题化、全局状态注入
- [ ] 样式`less`化
- [ ] 样式单位：em, rem?

## Resouces

- [Vite Building for Production](http://localhost:7005/guide/build.html#library-mode), library-mode
- [create-a-vue-3-component-with-typescript](https://blog.totominc.io/blog/create-a-vue-3-component-with-typescript)
