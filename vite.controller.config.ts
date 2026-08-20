import { resolve } from 'node:path'
import { defineConfig } from 'vite'

const projectRoot = import.meta.dirname

export default defineConfig(({ mode }) => ({
  build: {
    outDir: resolve(projectRoot, 'dist'),
    emptyOutDir: false,
    target: 'es2020',
    minify: mode === 'production',
    sourcemap: mode === 'development' ? 'inline' : false,
    rolldownOptions: {
      input: resolve(projectRoot, 'src/plugin/controller.ts'),
      output: {
        format: 'iife',
        entryFileNames: 'code.js'
      }
    }
  }
}))
