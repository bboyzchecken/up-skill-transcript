import { useEffect, useState } from 'react'
import QR from 'qrcode'

// QR สำหรับฉายจอ — encode ลิงก์ join ของกิจกรรม
export function QRCode({
  text,
  size = 220,
}: {
  text: string
  size?: number
}) {
  const [url, setUrl] = useState<string>('')

  useEffect(() => {
    let alive = true
    QR.toDataURL(text, {
      width: size * 2,
      margin: 1,
      color: { dark: '#2e1147', light: '#ffffff' },
      errorCorrectionLevel: 'M',
    })
      .then((u) => {
        if (alive) setUrl(u)
      })
      .catch(() => setUrl(''))
    return () => {
      alive = false
    }
  }, [text, size])

  return (
    <div
      style={{
        width: size,
        height: size,
        background: '#fff',
        borderRadius: 16,
        padding: 12,
        boxShadow: 'var(--shadow)',
        border: '1px solid var(--line)',
      }}
    >
      {url ? (
        <img
          src={url}
          width={size - 24}
          height={size - 24}
          alt="QR เข้าร่วมกิจกรรม"
          style={{ display: 'block' }}
        />
      ) : (
        <div className="empty" style={{ padding: 20 }}>
          กำลังสร้าง QR…
        </div>
      )}
    </div>
  )
}
