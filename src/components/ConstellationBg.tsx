import { useMemo } from 'react'

// ลาย constellation จาง ๆ สำหรับ hero (motif ใยแมงมุม/ดาว ตาม §7)
export function ConstellationBg({ seed = 7 }: { seed?: number }) {
  const { stars, lines } = useMemo(() => {
    let s = seed * 9301 + 49297
    const rnd = () => {
      s = (s * 9301 + 49297) % 233280
      return s / 233280
    }
    const pts = Array.from({ length: 26 }, () => ({
      x: rnd() * 100,
      y: rnd() * 100,
      r: 0.6 + rnd() * 1.8,
    }))
    const ln: [number, number][] = []
    for (let i = 0; i < pts.length; i++) {
      // เชื่อมกับจุดใกล้ ๆ ให้เหมือนกลุ่มดาว
      let best = -1
      let bd = 1e9
      for (let j = 0; j < pts.length; j++) {
        if (i === j) continue
        const d = (pts[i].x - pts[j].x) ** 2 + (pts[i].y - pts[j].y) ** 2
        if (d < bd && d > 30) {
          bd = d
          best = j
        }
      }
      if (best >= 0 && rnd() > 0.35) ln.push([i, best])
    }
    return { stars: pts, lines: ln }
  }, [seed])

  return (
    <svg
      className="constellation"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
    >
      {lines.map(([a, b], i) => (
        <line
          key={i}
          x1={stars[a].x}
          y1={stars[a].y}
          x2={stars[b].x}
          y2={stars[b].y}
          stroke="#e4c766"
          strokeWidth={0.15}
          opacity={0.4}
        />
      ))}
      {stars.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={p.r / 4} fill="#fff" opacity={0.7} />
      ))}
    </svg>
  )
}
