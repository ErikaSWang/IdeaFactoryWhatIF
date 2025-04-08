import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    hmr: true,
    allowedHosts: ['c3f9aabf-bf8f-4c21-967f-66a94fd01302-00-2kkpp817npzdg.picard.replit.dev', 'c3f9aabf-bf8f-4c21-967f-66a94fd01302-00-2kkpp817npzdg.picard.replit.dev:3000/', 'c3f9aabf-bf8f-4c21-967f-66a94fd01302-00-2kkpp817npzdg.picard.replit.dev:80/']
  }
})
