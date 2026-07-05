import { IDENTITY_LADDER } from '../lib/taxonomy'
import { DIMS } from '../theme'

// ─────────────────────────────────────────────────────────────
// Identity ladder LV1–6 (แนวตั้ง) — ไฮไลต์ระดับปัจจุบัน
// โซน Intra (1–3) / Entre (4–6) · ปลาย = LV6 อยู่บนสุด
// ─────────────────────────────────────────────────────────────
const CHAR = DIMS.character.color // ฟ้า BCA
const GOLD = '#c9a227'

export function IdentityLadder({
  level,
  compact = false,
}: {
  level: number // 0–6 (0 = ยังไม่เข้าเส้น)
  compact?: boolean
}) {
  const rungs = [...IDENTITY_LADDER].reverse() // LV6 บน → LV1 ล่าง
  return (
    <div className="stack" style={{ gap: 0 }}>
      <div className="row between" style={{ marginBottom: 8 }}>
        <span
          className="tag"
          style={{ background: '#eaf6fd', color: '#0d6ea0', fontWeight: 600 }}
        >
          Entrepreneurship · LV4–6
        </span>
        <span
          className="tag"
          style={{ background: 'var(--purple-tint)', color: 'var(--purple)' }}
        >
          Intrapreneurship · LV1–3
        </span>
      </div>
      {rungs.map((r) => {
        const reached = level >= r.level
        const current = level === r.level
        const accent = r.zone === 'entre' ? CHAR : 'var(--purple-soft)'
        return (
          <div
            key={r.level}
            className="row"
            style={{
              gap: 12,
              alignItems: 'stretch',
              opacity: reached ? 1 : 0.42,
            }}
          >
            {/* rail + node */}
            <div
              className="center"
              style={{
                position: 'relative',
                width: 34,
                flex: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  width: 3,
                  flex: 1,
                  background: reached ? accent : 'var(--line-strong)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: current ? 30 : 24,
                  height: current ? 30 : 24,
                  borderRadius: '50%',
                  display: 'grid',
                  placeItems: 'center',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: current ? 13 : 11.5,
                  color: reached ? '#fff' : 'var(--ink-faint)',
                  background: reached
                    ? `linear-gradient(140deg, ${accent}, ${r.zone === 'entre' ? '#1c7fb0' : 'var(--purple)'})`
                    : 'var(--surface)',
                  border: current
                    ? `3px solid ${GOLD}`
                    : reached
                      ? 'none'
                      : '2px solid var(--line-strong)',
                  boxShadow: current ? '0 0 0 4px rgba(201,162,39,0.22)' : 'none',
                  zIndex: 1,
                }}
              >
                {r.level}
              </div>
            </div>

            {/* content */}
            <div
              style={{
                padding: compact ? '7px 0' : '10px 0',
                borderBottom:
                  r.level > 1 ? '1px dashed var(--line)' : 'none',
                flex: 1,
              }}
            >
              <div className="row between" style={{ gap: 8 }}>
                <span
                  style={{
                    fontSize: compact ? 12.5 : 13.5,
                    fontWeight: 600,
                    color: current ? 'var(--purple)' : 'var(--ink)',
                  }}
                >
                  {r.title}
                </span>
                {current && (
                  <span
                    className="tag"
                    style={{
                      background: GOLD,
                      color: '#3a2c05',
                      fontWeight: 700,
                      fontSize: 10.5,
                    }}
                  >
                    ระดับปัจจุบัน
                  </span>
                )}
              </div>
              {!compact && (
                <div
                  className="faint"
                  style={{ fontSize: 11.5, marginTop: 2 }}
                  title={r.activities.join(' · ')}
                >
                  {r.activities.join(' · ')}
                </div>
              )}
            </div>
          </div>
        )
      })}
      {level === 0 && (
        <div className="faint" style={{ fontSize: 12, marginTop: 8 }}>
          ยังไม่เข้าเส้น Identity — เข้าร่วมกิจกรรมสาย Identity เพื่อปลดระดับแรก
        </div>
      )}
    </div>
  )
}
