import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Build used for the CrazyGames upload: relative asset paths, no Base44
// runtime injection and no Base44/Auth code in the bundle (App is swapped
// for src/StandaloneApp.jsx). Output: dist-standalone/ — zip its contents.
export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    alias: [
      { find: /^@\/App\.jsx$/, replacement: path.resolve(process.cwd(), 'src/StandaloneApp.jsx') },
      { find: /^@\//, replacement: `${path.resolve(process.cwd(), 'src')}/` },
    ],
  },
  build: {
    outDir: 'dist-standalone',
    emptyOutDir: true,
  },
})