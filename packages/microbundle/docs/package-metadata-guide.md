# 包元数据约定

本文记录 `@liutsing/enums` 这类库包的 `package.json` 入口字段约定。

## 推荐写法

```json
{
  "main": "dist/index.js",
  "umd:main": "dist/index.umd.js",
  "module": "dist/index.mjs",
  "source": "src/index.ts",
  "jsnext:main": "dist/index.mjs",
  "types": "types/index.d.ts",
  "typings": "types/index.d.ts",
  "sideEffects": false,
  "files": ["dist", "types"],
  "exports": {
    ".": {
      "types": "./types/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "default": "./dist/index.mjs"
    },
    "./package.json": "./package.json"
  }
}
```

## 字段含义

### 📦 旧生态/兼容字段

#### `main`

CommonJS 入口。给 `require()`、旧版 Node.js 工具链、旧版打包工具使用。

对应文件：

```txt
dist/index.js
```

#### `jsnext:main`

旧生态里的 ESM 入口字段。现在不是主要标准，但保留它可以兼容一些旧工具。
它和 `module` 指向同一个文件即可。

对应文件：

```txt
dist/index.mjs
```

#### `umd:main`

UMD 入口。这个文件应该是真正的 UMD 产物，而不是把 IIFE 文件改个名字。
UMD 可以同时兼容 CommonJS、AMD 和浏览器全局变量场景。

对应文件：

```txt
dist/index.umd.js
```

#### `typings`

旧版 TypeScript 声明文件入口字段，已逐步被 `types` 取代。保留它可以兼容一些
旧工具。

对应文件（与 `types` 指向同一个文件）：

```txt
types/index.d.ts
```

### 🆕 现代打包工具支持

#### `module`

ES Module 入口。现代打包工具会优先读取它，并且可以基于 ESM 的
`import/export` 做 tree shaking。

对应文件：

```txt
dist/index.mjs
```

#### `source`

源码入口，主要给本仓库里的构建工具读取。TypeScript 包通常指向：

```txt
src/index.ts
```

#### `types`

TypeScript 声明文件入口。现代 TypeScript 工具的默认字段。

对应文件：

```txt
types/index.d.ts
```

#### `sideEffects`

如果包是纯工具、纯枚举、纯类型导出，没有必须执行的全局副作用，可以设置：

```json
{
  "sideEffects": false
}
```

这样下游打包工具更容易删除未使用的导出。

如果包包含全局 CSS 注入、polyfill、埋点初始化、全局注册等副作用，不要设置为
`false`。

#### `files`

发布包时只带构建产物和类型声明：

```json
["dist", "types"]
```

压缩文件和 sourcemap 不需要单独写进元数据；只要它们在 `dist` 目录里，就会被
`files` 一起带进发布包。

## `exports` 写法

推荐使用显式的根入口：

```json
{
  ".": {
    "types": "./types/index.d.ts",
    "import": "./dist/index.mjs",
    "require": "./dist/index.js",
    "default": "./dist/index.mjs"
  },
  "./package.json": "./package.json"
}
```

这种写法比直接把 `import`、`require`、`types` 放在 `exports` 顶层更合适。
原因是它明确声明了包根入口，也为以后增加子路径导出留下空间。

建议把 `types` 放在条件对象的前面，方便 TypeScript 工具优先找到声明文件。

## 期望构建产物

执行：

```sh
microbundle -f es,cjs,umd
```

应生成：

```txt
dist/index.mjs
dist/index.mjs.map
dist/index.min.mjs
dist/index.min.mjs.map
dist/index.js
dist/index.js.map
dist/index.min.js
dist/index.min.js.map
dist/index.umd.js
dist/index.umd.js.map
dist/index.umd.min.js
dist/index.umd.min.js.map
types/index.d.ts
```

如果源码有多个模块，并由 `src/index.ts` 统一导出，那么 `types/` 下出现额外的
`.d.ts` 文件也是正常的。

## 压缩产物要不要写进入口字段？

不要。

入口字段应该指向可读的默认产物：

- `dist/index.mjs`
- `dist/index.js`
- `dist/index.umd.js`
- `types/index.d.ts`

`.min.*` 文件适合浏览器直连或 CDN 场景，但不应该成为 `main`、`module` 或
`exports` 的默认入口。

## 判断规则

- `exports` 是现代消费者的主入口声明。
- `main`、`module`、`jsnext:main`、`umd:main` 用来兼容旧工具链。
- `dist` 和 `types` 应该发布，源码内部文件不必发布。
- sourcemap 和压缩文件不要单独声明为入口。
- 只有确认包没有必要副作用时，才设置 `sideEffects: false`。
