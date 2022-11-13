import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    Vue({
      style: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        filename: 'style.css', // FIXME
      },
    }),
  ],
  build: {
    outDir: './dist',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: '@liutsing/vue-components',
      fileName: (format) => `${'@liutsing/vue-components'}.${format}.js`,
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})
