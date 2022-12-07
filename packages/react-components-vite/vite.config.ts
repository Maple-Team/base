import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

const libName = '@liutsing/rcv-components'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2015',
    outDir: './dist',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: libName,
      fileName: (format) => `${libName}.${format}.js`,
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled into your library
      external: ['react', 'react-dom'],
      output: {
        // Provide global variables to use in the UMD build for externalized deps
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
})
