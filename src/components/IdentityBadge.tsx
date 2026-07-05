import { DIMS } from '../theme'
import { rungOf } from '../lib/taxonomy'

// ─────────────────────────────────────────────────────────────
// วงแหวนคะแนน Identity% + ระดับตรงกลาง — ใช้บน transcript / portfolio
// ─────────────────────────────────────────────────────────────
export function IdentityBadge({
  level,
  score,
  size = 128,
}: {
  level: number // 0–6
  score: number // 0–100
  size?: number
}) {
  const r = (size - 14) / 2
  const c = 2 * Math.PI * r
  const frac = Math.max(0, Math.min(1, score / 100))
  const rung = rungOf(level)
  const zoneLabel = level === 0 ? '—' : level >= 4 ? 'Entrepreneur' : 'Intrapreneur'
  const accent = level >= 4 ? DIMS.character.color : '#7A4BA8'

  return (
    <div
      className="center"
      style={{ display: 'grid', placeItems: 'center', gap: 6 }}
    >
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="var(--purple-tint)"
            strokeWidth={10}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={accent}
            strokeWidth={10}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c * (1 - frac)}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ transition: 'stroke-dashoffset 0.7s ease' }}
          />
        </svg>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            placeItems: 'center',
            textAlign: 'center',
          }}
        >
          <div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: size * 0.26,
                fontWeight: 700,
                color: accent,
                lineHeight: 1,
              }}
            >
              {score}
              <span style={{ fontSize: size * 0.12, fontWeight: 500 }}>%</span>
            </div>
            <div
              className="mono faint"
              style={{ fontSize: size * 0.085, marginTop: 2 }}
            >
              Identity
            </div>
          </div>
        </div>
      </div>
      <div className="center">
        <div style={{ fontSize: 13.5, fontWeight: 700, color: accent }}>
          {level === 0 ? 'ยังไม่เข้าเส้น' : `LV${level} · ${zoneLabel}`}
        </div>
        {rung && (
          <div className="faint" style={{ fontSize: 11.5, maxWidth: 180 }}>
            {rung.title}
          </div>
        )}
      </div>
    </div>
  )
}
