import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

const projectRoot = import.meta.dirname
const appRoot = resolve(projectRoot, 'src/app')

export default defineConfig(({ mode }) => ({
  root: appRoot,
  base: './',
  resolve: {
    alias: {
      '@': appRoot
    }
  },
  plugins: [viteSingleFile()],
  build: {
    outDir: resolve(projectRoot, 'dist'),
    emptyOutDir: mode === 'production',
    target: 'es2020',
    minify: mode === 'production',
    sourcemap: mode === 'development' ? 'inline' : false,
    rolldownOptions: {
      input: resolve(appRoot, 'ui.html')
    }
  }
}))
