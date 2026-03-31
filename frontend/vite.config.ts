import { defineConfig } from 'vite'
import { reactCompilerPreset } from '@vitejs/plugin-react'
import { reactRouter } from '@react-router/dev/vite'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // react(),
    reactRouter(),
    tailwindcss(),
    babel({ presets: [reactCompilerPreset()] })
  ],
})
