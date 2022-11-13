import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'

const libName = '@liutsing/vue-components'
export default defineConfig({
  plugins: [
    Vue({
      style: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        filename: `${libName}.css`, // FIXME 类型报错
      },
    }),
  ],
  build: {
    // FIXME  legacy?
    target: 'es2015', // Compatibility transform target. The transform is performed with esbuild and the lowest supported target is es2015/es6. Note this only handles syntax transformation and does not cover polyfills (except for dynamic import)
    outDir: './dist',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: libName,
      fileName: (format) => `${libName}.${format}.js`,
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled into your library
      external: ['vue'],
      output: {
        // Provide global variables to use in the UMD build for externalized deps
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})
