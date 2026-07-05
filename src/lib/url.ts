// สร้าง path/URL ที่เคารพ base ของ Vite (สำคัญตอน deploy ใต้ subpath เช่น GitHub Pages)
// React Router (Link/navigate) จัดการ basename ให้เอง — helper นี้ไว้ใช้กับลิงก์นอก router
// เช่น QR ที่ encode absolute URL หรือ window.open

export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '') // '' หรือ '/up-skill-transcript'
  const p = path.startsWith('/') ? path : `/${path}`
  return `${base}${p}`
}

export function absoluteUrl(path: string): string {
  return `${window.location.origin}${withBase(path)}`
}
