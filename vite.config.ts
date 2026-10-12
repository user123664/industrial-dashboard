import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: './',
  server: {
    port: 3000,
    open: true
  },
  build: {
    target: 'es2015',
    outDir: 'dist',
    chunkSizeWarningLimit: 2000
  }
})
