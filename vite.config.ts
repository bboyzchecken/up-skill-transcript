import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// เดโม่รันจอเดียว/สองแท็บบนแล็ปท็อป — เปิด host ไว้เผื่อฉายผ่าน LAN ได้
// base ตั้งผ่าน env (GitHub Pages = /up-skill-transcript/ · โฮสต์ root = /)
export default defineConfig({
  base: process.env.VITE_BASE ?? '/',
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
})
