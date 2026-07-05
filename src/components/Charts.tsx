import { useId } from 'react'
import type { TimePoint } from '../types'

// ── รายการบาร์แนวนอน ──
export interface BarItem {
  label: string
  value: number
  sub?: string
  color?: string
}
export function BarList({
  items,
  unit = '',
  maxBarColor = 'var(--purple)',
}: {
  items: BarItem[]
  unit?: string
  maxBarColor?: string
}) {
  const max = Math.max(1, ...items.map((i) => i.value))
  return (
    <div className="stack gap-sm">
      {items.map((it, idx) => (
        <div key={idx}>
          <div className="row between" style={{ marginBottom: 4 }}>
            <span style={{ fontSize: 13.5, fontWeight: 500 }}>{it.label}</span>
            <span className="mono" style={{ fontSize: 12.5, color: 'var(--ink-soft)' }}>
              {it.value.toLocaleString('th-TH')}
              {unit}
            </span>
          </div>
          <div
            style={{
              height: 8,
              background: 'var(--purple-tint)',
              borderRadius: 999,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${(it.value / max) * 100}%`,
                height: '100%',
                borderRadius: 999,
                background: it.color ?? maxBarColor,
                transition: 'width 0.6s cubic-bezier(0.22,1,0.36,1)',
              }}
            />
          </div>
          {it.sub && (
            <div className="faint" style={{ fontSize: 11.5, marginTop: 3 }}>
              {it.sub}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ── กราฟเส้น timeline ──
export function LineChart({
  data,
  height = 190,
}: {
  data: TimePoint[]
  height?: number
}) {
  const uid = useId().replace(/:/g, '')
  const W = 640
  const H = height
  const padX = 26
  const padY = 26
  const max = Math.max(1, ...data.map((d) => d.count))
  const n = data.length

  if (n === 0) return <div className="empty">ยังไม่มีข้อมูล</div>

  const x = (i: number) =>
    padX + (i * (W - padX * 2)) / Math.max(1, n - 1)
  const y = (v: number) => H - padY - (v / max) * (H - padY * 2)

  const linePts = data.map((d, i) => `${x(i)},${y(d.count)}`).join(' ')
  const areaPts = `${x(0)},${H - padY} ${linePts} ${x(n - 1)},${H - padY}`

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
      <defs>
        <linearGradient id={`area-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7a4ba8" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#7a4ba8" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* gridlines */}
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <line
          key={f}
          x1={padX}
          x2={W - padX}
          y1={y(max * f)}
          y2={y(max * f)}
          stroke="#eee7f5"
          strokeWidth={1}
        />
      ))}
      <polygon points={areaPts} fill={`url(#area-${uid})`} />
      <polyline
        points={linePts}
        fill="none"
        stroke="#4a1e6e"
        strokeWidth={2.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {data.map((d, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(d.count)} r={3.5} fill="#fff" stroke="#c9a227" strokeWidth={2.5} />
          <text
            x={x(i)}
            y={H - 8}
            textAnchor="middle"
            fontFamily="'IBM Plex Sans Thai', sans-serif"
            fontSize={11}
            fill="#9c94ad"
          >
            {d.label}
          </text>
        </g>
      ))}
    </svg>
  )
}
