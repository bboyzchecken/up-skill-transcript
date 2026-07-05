import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { getStore } from './store'

// ให้แน่ใจว่า seed พร้อมตั้งแต่เปิดแอป (เปิดมามีข้อมูลทันที)
getStore().seed()

// basename รองรับ deploy ใต้ subpath (GitHub Pages) — locale/dev = '/'
const basename = import.meta.env.BASE_URL.replace(/\/$/, '')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
