import { useEffect, useRef, useState } from 'react'

// ตัวเลข count-up สำหรับ KPI (motion เบา ตาม §7)
export function CountUp({
  value,
  duration = 900,
  decimals = 0,
}: {
  value: number
  duration?: number
  decimals?: number
}) {
  const [display, setDisplay] = useState(0)
  const raf = useRef<number>()
  const from = useRef(0)

  useEffect(() => {
    const start = performance.now()
    const startVal = from.current
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(startVal + (value - startVal) * eased)
      if (t < 1) raf.current = requestAnimationFrame(tick)
      else from.current = value
    }
    raf.current = requestAnimationFrame(tick)
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [value, duration])

  const text =
    decimals > 0
      ? display.toFixed(decimals)
      : Math.round(display).toLocaleString('th-TH')
  return <span>{text}</span>
}
