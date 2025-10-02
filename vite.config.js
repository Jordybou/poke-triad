import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const pkg = JSON.parse(readFileSync(path.join(__dirname, 'package.json'), 'utf-8'))
const APP_VERSION = pkg.version

export default defineConfig({
  root: 'frontend',
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/auth': 'http://localhost:4000',
      '/me': 'http://localhost:4000',
      '/progress': 'http://localhost:4000',
    },
  },
  build: { outDir: '../dist', emptyOutDir: true },
  define: {
    __APP_VERSION__: JSON.stringify(APP_VERSION),
  },
})