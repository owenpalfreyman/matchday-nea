import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // The below allows the "@" to mark the "src" directory
      '@': fileURLToPath(new URL('./src', import.meta.url)), // meta.url returns the current file
    },
  },
})
