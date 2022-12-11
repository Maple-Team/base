import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
import react from '@vitejs/plugin-react-swc'
import { visualizer } from 'rollup-plugin-visualizer'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // @ts-ignore
    visualizer({ open: true, gzipSize: true }),
  ],
  resolve: {
    alias: {
      '@/': path.resolve(__dirname, './src'),
    },
  },
})
