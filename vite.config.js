import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    proxy: {
      '/api/behance': {
        target: 'https://www.behance.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/behance/, ''),
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      },
      '/api/artstation': {
        target: 'https://www.artstation.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/artstation/, ''),
      }
    }
  }
})
