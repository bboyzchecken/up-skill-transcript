// สร้าง path/URL สำหรับลิงก์ที่อยู่ "นอก" React Router (QR ที่ encode absolute URL, window.open)
// ใช้ HashRouter → route อยู่หลัง # · asset/หน้าเว็บอยู่ใต้ base ของ Vite (เช่น /skill-transcript/)
// ผลลัพธ์รูปแบบ: <origin><base>#<route>  เช่น https://owldayhouse.com/skill-transcript/#/join/CODE

function base(): string {
  return import.meta.env.BASE_URL // ลงท้ายด้วย '/' เสมอ เช่น '/skill-transcript/' หรือ '/'
}

/** ลิงก์แบบ relative (ใช้กับ window.open) — /skill-transcript/#/join/CODE */
export function withBase(route: string): string {
  const r = route.startsWith('/') ? route : `/${route}`
  return `${base()}#${r}`
}

/** ลิงก์แบบเต็ม (ใช้ encode ลง QR) — https://host/skill-transcript/#/join/CODE */
export function absoluteUrl(route: string): string {
  return `${window.location.origin}${withBase(route)}`
}
