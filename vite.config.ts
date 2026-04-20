import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_BASE_ENDPOINT || 'https://dev.ibapplications.com/rest/v1',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
        headers: {
          Cookie: process.env.VITE_COOKIE || '',
        },
      },
      '/auth': {
        target: 'https://idp.ibapplications.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/auth/, ''),
        headers: {
          Cookie: process.env.VITE_COOKIE || '',
        },
      },
    }
  }
})
