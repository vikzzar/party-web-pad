import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    host: true,
    proxy: {
      '/ws': {
        target: 'ws://localhost:5150',
        ws: true,
      },
    },
  }
})
