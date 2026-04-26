import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: [],
      onwarn(warning, warn) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return
        if (warning.code === 'SOURCEMAP_ERROR') return
        if (warning.message.includes('use client')) return
        if (warning.message.includes('use server')) return
        warn(warning)
      }
    }
  },
  optimizeDeps: {
    include: ['recharts']
  }
})
