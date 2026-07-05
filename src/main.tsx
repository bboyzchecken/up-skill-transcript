import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { getStore } from './store'

// ให้แน่ใจว่า seed พร้อมตั้งแต่เปิดแอป (เปิดมามีข้อมูลทันที)
getStore().seed()

// HashRouter: routing อยู่หลัง # ทั้งหมด → static ล้วน วางใต้ subpath ไหนก็ได้
// (owldayhouse.com/skill-transcript/) โดยไม่ต้องตั้ง rewrite rule ที่เซิร์ฟเวอร์
// deep link/QR ก็ทำงานเมื่อรีเฟรช เพราะเบราว์เซอร์โหลด index.html เดิมเสมอ
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
)
