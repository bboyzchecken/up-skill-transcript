import { DOMAINS } from '../lib/taxonomy'
import type { Domain } from '../types'

// ─────────────────────────────────────────────────────────────
// Sunburst competency wheel (static, Tier A) — hand-rolled SVG arcs
// 3 วง: โดเมน → กลุ่มย่อย → โค้ด · สีตาม palette 7 โดเมน
// Recharts ไม่มี sunburst → วาด annular sector เอง
// ─────────────────────────────────────────────────────────────

// lighten hex สีเข้าหาขาว (t=0 = สีเดิม, t=1 = ขาว)
function lighten(hex: string, t: number): string {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  const mix = (c: number) => Math.round(c + (255 - c) * t)
  return `rgb(${mix(r)},${mix(g)},${mix(b)})`
}

function polar(cx: number, cy: number, r: number, a: number) {
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const
}

// annular sector path (rIn→rOut, a0→a1) เป็นเรเดียน
function arcPath(
  cx: number,
  cy: number,
  rIn: number,
  rOut: number,
  a0: number,
  a1: number,
): string {
  const large = a1 - a0 > Math.PI ? 1 : 0
  const [x0o, y0o] = polar(cx, cy, rOut, a0)
  const [x1o, y1o] = polar(cx, cy, rOut, a1)
  const [x1i, y1i] = polar(cx, cy, rIn, a1)
  const [x0i, y0i] = polar(cx, cy, rIn, a0)
  return [
    `M ${x0o} ${y0o}`,
    `A ${rOut} ${rOut} 0 ${large} 1 ${x1o} ${y1o}`,
    `L ${x1i} ${y1i}`,
    `A ${rIn} ${rIn} 0 ${large} 0 ${x0i} ${y0i}`,
    'Z',
  ].join(' ')
}

interface Seg {
  path: string
  fill: string
  label: string
  mid: number
  rMid: number
  stroke: string
  fontSize: number
  rotate: boolean
  showText: boolean
}

export function SunburstWheel({
  size = 460,
  domains = DOMAINS,
  showCodes = true,
  showLegend = true,
}: {
  size?: number
  domains?: Domain[]
  showCodes?: boolean
  showLegend?: boolean
}) {
  const cx = size / 2
  const cy = size / 2
  const R = size / 2 - 4
  const r0 = R * 0.2 // hole (center label)
  const rDomain = R * 0.44
  const rGroup = R * 0.7
  const rCode = R

  // นับ leaf ต่อโดเมน → span เชิงมุมเท่ากันต่อ leaf
  const totalLeaves = domains.reduce(
    (s, d) => s + d.groups.reduce((g, gr) => g + gr.items.length, 0),
    0,
  )
  const step = (2 * Math.PI) / totalLeaves
  const start = -Math.PI / 2 // เริ่มบนสุด

  const segs: Seg[] = []
  let cursor = start
  for (const d of domains) {
    const dLeaves = d.groups.reduce((g, gr) => g + gr.items.length, 0)
    const dA0 = cursor
    const dA1 = cursor + dLeaves * step
    const dMid = (dA0 + dA1) / 2
    segs.push({
      path: arcPath(cx, cy, r0, rDomain, dA0, dA1),
      fill: d.color,
      label: d.label,
      mid: dMid,
      rMid: (r0 + rDomain) / 2,
      stroke: '#fff',
      fontSize: 11.5,
      rotate: false,
      showText: false, // ชื่อโดเมนย้ายไป legend แทน (กันตัวอักษรทับกันกลางวง)
    })

    let gCursor = dA0
    for (const gr of d.groups) {
      const gA0 = gCursor
      const gA1 = gCursor + gr.items.length * step
      const gMid = (gA0 + gA1) / 2
      segs.push({
        path: arcPath(cx, cy, rDomain, rGroup, gA0, gA1),
        fill: lighten(d.color, 0.32),
        label: gr.prefix,
        mid: gMid,
        rMid: (rDomain + rGroup) / 2,
        stroke: '#fff',
        fontSize: 10,
        rotate: false,
        showText: true,
      })

      if (showCodes) {
        let cCursor = gA0
        for (const item of gr.items) {
          const cA0 = cCursor
          const cA1 = cCursor + step
          const cMid = (cA0 + cA1) / 2
          segs.push({
            path: arcPath(cx, cy, rGroup, rCode, cA0, cA1),
            fill: lighten(d.color, 0.58),
            label: item.code,
            mid: cMid,
            rMid: (rGroup + rCode) / 2 + 2,
            stroke: '#fff',
            fontSize: 7.5,
            rotate: true,
            showText: true,
          })
          cCursor = cA1
        }
      }
      gCursor = gA1
    }
    cursor = dA1
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 14,
        width: '100%',
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ display: 'block', maxWidth: '100%', height: 'auto' }}
      >
      {segs.map((s, i) => (
        <path key={i} d={s.path} fill={s.fill} stroke={s.stroke} strokeWidth={1} />
      ))}
      {segs.filter((s) => s.showText).map((s, i) => {
        const [x, y] = polar(cx, cy, s.rMid, s.mid)
        let deg = (s.mid * 180) / Math.PI
        if (s.rotate) {
          // ให้ข้อความชี้ตามแนวรัศมี อ่านง่าย
          if (deg > 90 && deg < 270) deg += 180
        } else {
          deg = 0
        }
        return (
          <text
            key={i}
            x={x}
            y={y}
            transform={s.rotate ? `rotate(${deg} ${x} ${y})` : undefined}
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily={
              s.fontSize > 9
                ? "'IBM Plex Sans Thai', sans-serif"
                : "'IBM Plex Mono', monospace"
            }
            fontSize={s.fontSize}
            fontWeight={s.fontSize > 9 ? 700 : 500}
            fill={s.fontSize > 9 ? '#fff' : 'rgba(30,20,45,0.72)'}
          >
            {s.label}
          </text>
        )
      })}
      {/* center */}
      <circle cx={cx} cy={cy} r={r0} fill="var(--purple)" />
      <text
        x={cx}
        y={cy - 6}
        textAnchor="middle"
        fontFamily="var(--font-display)"
        fontSize={15}
        fontWeight={700}
        fill="#fff"
      >
        BCA
      </text>
      <text
        x={cx}
        y={cy + 11}
        textAnchor="middle"
        fontFamily="'IBM Plex Sans Thai', sans-serif"
        fontSize={8.5}
        fill="var(--gold-soft)"
      >
        Competency
      </text>
      </svg>

      {showLegend && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '7px 14px',
            maxWidth: size + 40,
          }}
        >
          {domains.map((d) => (
            <span
              key={d.key}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 12.5,
                color: 'var(--ink)',
              }}
            >
              <span
                style={{
                  width: 11,
                  height: 11,
                  borderRadius: 3,
                  background: d.color,
                  flex: 'none',
                }}
              />
              {d.label}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
