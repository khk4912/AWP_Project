import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import { reactCompilerPreset } from '@vitejs/plugin-react'
import { reactRouter } from '@react-router/dev/vite'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
    },
  },
  plugins: [
    // react(),
    reactRouter(),
    tailwindcss(),
    babel({ presets: [reactCompilerPreset()] })
  ],
})
