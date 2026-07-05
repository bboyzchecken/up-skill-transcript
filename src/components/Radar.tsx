import { useEffect, useId, useRef, useState } from 'react'
import type { Dims, DimKey } from '../types'
import { DIMS, DIM_LIST } from '../theme'

interface RadarProps {
  values: Dims
  max: Dims
  size?: number
  showLabels?: boolean
  animate?: boolean
  /** สีเส้น/พื้น: 'brand' = ม่วง–ทอง (มพ.) */
  tone?: 'brand'
  /** เลือกเฉพาะบางแกน (เปิด/ปิดแกนได้) — ไม่ส่ง = ครบ 7 โดเมน */
  axes?: DimKey[]
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

export function Radar({
  values,
  max,
  size = 320,
  showLabels = true,
  animate = true,
  tone = 'brand',
  axes,
}: RadarProps) {
  void tone
  const dims = axes && axes.length >= 3 ? axes.map((k) => DIMS[k]) : DIM_LIST
  const uid = useId().replace(/:/g, '')
  const [progress, setProgress] = useState(animate ? 0 : 1)
  const raf = useRef<number>()

  useEffect(() => {
    if (!animate) {
      setProgress(1)
      return
    }
    const start = performance.now()
    const dur = 800
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur)
      setProgress(easeOutCubic(t))
      if (t < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current)
    }
    // re-run เมื่อค่าคะแนนเปลี่ยน (เช่นเลื่อนสไลเดอร์/join ใหม่)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animate, JSON.stringify(values), JSON.stringify(max)])

  const pad = showLabels ? 54 : 12
  const cx = size / 2
  const cy = size / 2
  const R = size / 2 - pad
  const n = dims.length

  const angle = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / n
  const pointAt = (i: number, r: number) => {
    const a = angle(i)
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const
  }

  // rings
  const rings = [0.25, 0.5, 0.75, 1].map((f) => {
    const pts = dims.map((_, i) => pointAt(i, R * f).join(',')).join(' ')
    return { f, pts }
  })

  // value polygon
  const valuePts = dims.map((dm, i) => {
    const frac = Math.max(0, Math.min(1, values[dm.key] / Math.max(1, max[dm.key])))
    return pointAt(i, R * frac * progress)
  })
  const valueStr = valuePts.map((p) => p.join(',')).join(' ')

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ display: 'block', maxWidth: '100%' }}
    >
      <defs>
        <radialGradient id={`fill-${uid}`} cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#c9a227" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#4a1e6e" stopOpacity="0.32" />
        </radialGradient>
      </defs>

      {/* rings */}
      {rings.map((r) => (
        <polygon
          key={r.f}
          points={r.pts}
          fill="none"
          stroke="#d8cfe6"
          strokeWidth={1}
          opacity={r.f === 1 ? 0.9 : 0.55}
        />
      ))}

      {/* axes */}
      {dims.map((_, i) => {
        const [x, y] = pointAt(i, R)
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={x}
            y2={y}
            stroke="#e0d8ee"
            strokeWidth={1}
          />
        )
      })}

      {/* value shape */}
      <polygon
        points={valueStr}
        fill={`url(#fill-${uid})`}
        stroke="#4a1e6e"
        strokeWidth={2}
        strokeLinejoin="round"
      />

      {/* vertices — สีประจำด้าน */}
      {valuePts.map((p, i) => (
        <circle
          key={i}
          cx={p[0]}
          cy={p[1]}
          r={4}
          fill="#fff"
          stroke={dims[i].color}
          strokeWidth={2.5}
        />
      ))}

      {/* labels */}
      {showLabels &&
        dims.map((dm, i) => {
          const [x, y] = pointAt(i, R + 26)
          const anchor =
            Math.abs(x - cx) < 6 ? 'middle' : x > cx ? 'start' : 'end'
          return (
            <g key={dm.key}>
              <circle cx={x} cy={y - 13} r={3.5} fill={dm.color} />
              <text
                x={x}
                y={y}
                textAnchor={anchor}
                fontFamily="'IBM Plex Sans Thai', sans-serif"
                fontSize={12.5}
                fontWeight={600}
                fill="#4a3d59"
              >
                {dm.short}
              </text>
              <text
                x={x}
                y={y + 15}
                textAnchor={anchor}
                fontFamily="'IBM Plex Mono', monospace"
                fontSize={11}
                fill="#9c94ad"
              >
                {values[dm.key]}
              </text>
            </g>
          )
        })}
    </svg>
  )
}
