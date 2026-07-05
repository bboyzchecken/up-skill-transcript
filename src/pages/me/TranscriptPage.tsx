import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useLive } from '../../store'
import { buildTranscript } from '../../store/views'
import { Radar } from '../../components/Radar'
import { ConstellationBg } from '../../components/ConstellationBg'
import { Avatar, DimTag } from '../../components/common'
import { DimIcon } from '../../components/DimIcon'
import { DIMS } from '../../theme'
import { formatDateTh, fullName } from '../../lib/format'
import type { DimKey } from '../../types'

export function TranscriptPage() {
  const { studentId } = useParams()
  if (!studentId) return <TranscriptPicker />
  return <TranscriptView studentId={studentId} />
}

// ── ตัวเลือกนิสิต ──
function TranscriptPicker() {
  const nav = useNavigate()
  const [query, setQuery] = useState('')
  const data = useLive(
    (s) => {
      const featured = ['st-0001', 'st-0002', 'st-0003', 'st-0004']
        .map((id) => s.students.find((st) => st.id === id))
        .filter(Boolean) as (typeof s.students)[number][]
      const q = query.trim().toLowerCase()
      const results = q
        ? s.students
            .filter(
              (st) =>
                `${st.firstName} ${st.lastName}`.toLowerCase().includes(q) ||
                st.studentCode.includes(q),
            )
            .slice(0, 8)
        : []
      return { featured, results }
    },
    [query],
  )

  return (
    <div style={{ maxWidth: 620, margin: '0 auto' }}>
      <div className="center">
        <span className="eyebrow">My Transcript</span>
        <h1 style={{ fontSize: 26, marginTop: 6 }}>เลือกนิสิตเพื่อดูทรานสคริปต์</h1>
        <p className="muted" style={{ fontSize: 13.5, marginTop: 4 }}>
          หรือเริ่มจากนิสิตตัวอย่างเด่นสำหรับการนำเสนอ
        </p>
      </div>

      <div className="card pad section">
        <input
          type="search"
          placeholder="ค้นหาชื่อหรือรหัสนิสิต…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {data.results.length > 0 && (
          <div className="stack" style={{ gap: 6, marginTop: 10 }}>
            {data.results.map((st) => (
              <button
                key={st.id}
                className="row gap-sm"
                style={{
                  padding: '8px 10px',
                  borderRadius: 10,
                  border: '1px solid var(--line)',
                  background: 'var(--surface)',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
                onClick={() => nav(`/me/${st.id}`)}
              >
                <Avatar student={st} size={34} />
                <div className="grow">
                  <div style={{ fontSize: 13.5, fontWeight: 600 }}>
                    {fullName(st)}
                  </div>
                  <div className="faint mono" style={{ fontSize: 11 }}>
                    {st.studentCode} · {st.major} · ปี {st.year}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="section">
        <div className="muted" style={{ fontSize: 12.5, marginBottom: 8 }}>
          นิสิตตัวอย่างเด่น
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))',
            gap: 10,
          }}
        >
          {data.featured.map((st) => (
            <Link
              key={st.id}
              to={`/me/${st.id}`}
              className="card pad hoverable center"
              style={{ display: 'grid', placeItems: 'center', gap: 8 }}
            >
              <Avatar student={st} size={48} />
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 600 }}>
                  {st.firstName}
                </div>
                <div className="faint" style={{ fontSize: 11.5 }}>
                  {st.major}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── มุมมองทรานสคริปต์ ──
function TranscriptView({ studentId }: { studentId: string }) {
  const tr = useLive((s) => {
    try {
      return buildTranscript(s, studentId)
    } catch {
      return null
    }
  }, [studentId])

  if (!tr) {
    return (
      <div className="empty">
        ไม่พบนิสิต · <Link to="/me">เลือกนิสิตใหม่</Link>
      </div>
    )
  }

  const st = tr.student
  return (
    <div>
      {/* hero */}
      <div className="hero" style={{ padding: 28 }}>
        <ConstellationBg seed={st.avatarHue} />
        <div
          className="row wrap between"
          style={{ position: 'relative', gap: 16 }}
        >
          <div className="row gap-sm">
            <Avatar student={st} size={58} />
            <div>
              <span className="eyebrow" style={{ color: 'var(--gold-soft)' }}>
                <Link to="/me" style={{ color: 'inherit' }}>
                  ← เปลี่ยนนิสิต
                </Link>
              </span>
              <h1 style={{ fontSize: 26, marginTop: 2 }}>{fullName(st)}</h1>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13.5 }}>
                <span className="mono">{st.studentCode}</span> · {st.major} · ปี{' '}
                {st.year}
              </p>
            </div>
          </div>
          <div
            style={{
              textAlign: 'right',
              color: 'rgba(255,255,255,0.85)',
            }}
          >
            <div style={{ fontSize: 12 }}>เข้าร่วมแล้ว</div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 30,
                fontWeight: 700,
                color: '#fff',
              }}
            >
              {tr.completedCount}
              <span style={{ fontSize: 14, fontWeight: 400 }}> กิจกรรม</span>
            </div>
          </div>
        </div>
      </div>

      <div className="section split">
        {/* radar */}
        <div className="card pad" style={{ display: 'grid', placeItems: 'center' }}>
          <div className="panel-title" style={{ width: '100%' }}>
            <h3>เรดาร์ทักษะ 6 ด้าน</h3>
            <span className="hint">เทียบกับสูงสุดในคณะ</span>
          </div>
          <Radar values={tr.totals} max={tr.axisMax} size={360} />
        </div>

        {/* insights */}
        <div className="stack">
          {/* persona (Character template) */}
          <div
            className="card pad"
            style={{
              background:
                'linear-gradient(140deg, var(--purple), var(--purple-deep))',
              color: '#fff',
              border: 'none',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <ConstellationBg seed={st.avatarHue + 3} />
            <div style={{ position: 'relative' }}>
              <span
                className="mono"
                style={{
                  fontSize: 11,
                  letterSpacing: '0.14em',
                  color: 'var(--gold-soft)',
                  textTransform: 'uppercase',
                }}
              >
                ฉายาประจำตัว
              </span>
              <h2 style={{ color: '#fff', fontSize: 23, marginTop: 6 }}>
                {tr.persona.archetype}
              </h2>
              <div
                style={{
                  color: 'var(--gold-soft)',
                  fontWeight: 600,
                  fontSize: 14,
                  marginTop: 2,
                }}
              >
                “{tr.persona.tagline}”
              </div>
              <p
                style={{
                  color: 'rgba(255,255,255,0.86)',
                  fontSize: 13.5,
                  marginTop: 10,
                  lineHeight: 1.6,
                }}
              >
                {tr.persona.description}
              </p>
            </div>
          </div>

          {/* จุดเด่น / ควรเสริม */}
          <div className="grid-2">
            <HighlightCard title="จุดเด่น" dims={tr.top2} totals={tr.totals} kind="up" />
            <HighlightCard
              title="ควรเสริม"
              dims={tr.bottom2}
              totals={tr.totals}
              kind="down"
            />
          </div>

          {/* balance */}
          <div className="card pad">
            <div className="row between" style={{ marginBottom: 8 }}>
              <h3 style={{ fontSize: 15 }}>คะแนนสมดุล</h3>
              <span
                className="mono"
                style={{ fontWeight: 700, color: 'var(--purple)', fontSize: 18 }}
              >
                {tr.balanceScore}
                <span className="faint" style={{ fontSize: 12 }}>/100</span>
              </span>
            </div>
            <div
              style={{
                height: 10,
                borderRadius: 999,
                background:
                  'linear-gradient(90deg, #ec4899, #f59e0b, #10b981)',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: `${tr.balanceScore}%`,
                  top: -3,
                  width: 4,
                  height: 16,
                  background: 'var(--ink)',
                  borderRadius: 2,
                  transform: 'translateX(-50%)',
                }}
              />
            </div>
            <div className="row between faint" style={{ fontSize: 11.5, marginTop: 6 }}>
              <span>เชี่ยวเฉพาะทาง</span>
              <span>รอบด้าน</span>
            </div>
          </div>
        </div>
      </div>

      {/* คะแนนรวมแต่ละด้าน */}
      <div className="section card pad">
        <div className="panel-title">
          <h3>คะแนนสะสมรายด้าน</h3>
          <span className="hint">รวมจากทุกกิจกรรม</span>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))',
            gap: 14,
          }}
        >
          {(Object.keys(DIMS) as DimKey[]).map((k) => {
            const v = tr.totals[k]
            const max = tr.axisMax[k]
            return (
              <div key={k}>
                <div className="row between" style={{ marginBottom: 4 }}>
                  <span className="row gap-sm" style={{ fontSize: 13 }}>
                    <DimIcon dim={k} size={15} color={DIMS[k].color} />
                    {DIMS[k].labelTh}
                  </span>
                  <span className="mono" style={{ fontSize: 12.5, color: DIMS[k].color, fontWeight: 600 }}>
                    {v}
                  </span>
                </div>
                <div style={{ height: 7, background: 'var(--purple-tint)', borderRadius: 999 }}>
                  <div
                    style={{
                      width: `${(v / max) * 100}%`,
                      height: '100%',
                      background: DIMS[k].color,
                      borderRadius: 999,
                      transition: 'width 0.6s ease',
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* timeline กิจกรรม */}
      <div className="section card pad">
        <div className="panel-title">
          <h3>กิจกรรมที่เข้าร่วม</h3>
          <span className="hint">{tr.activities.length} รายการ</span>
        </div>
        {tr.activities.length === 0 ? (
          <div className="empty">ยังไม่เข้าร่วมกิจกรรมใด</div>
        ) : (
          <div className="stack" style={{ gap: 10 }}>
            {tr.activities.map(({ participation, activity }) => {
              const tops = (Object.keys(DIMS) as DimKey[])
                .filter((k) => activity.dims[k] >= 5)
                .sort((a, b) => activity.dims[b] - activity.dims[a])
                .slice(0, 3)
              return (
                <div
                  key={participation.id}
                  className="row between wrap"
                  style={{
                    gap: 10,
                    padding: '12px 14px',
                    borderRadius: 12,
                    border: '1px solid var(--line)',
                    background: 'var(--surface-2)',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>
                      {activity.name}
                    </div>
                    <div className="faint" style={{ fontSize: 12 }}>
                      {formatDateTh(activity.startAt)} · {activity.category}
                    </div>
                  </div>
                  <div className="row wrap gap-sm">
                    {tops.map((k) => (
                      <DimTag key={k} dim={k} showIcon={false} />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function HighlightCard({
  title,
  dims,
  totals,
  kind,
}: {
  title: string
  dims: DimKey[]
  totals: Record<DimKey, number>
  kind: 'up' | 'down'
}) {
  return (
    <div className="card pad">
      <div className="row gap-sm" style={{ marginBottom: 10 }}>
        {kind === 'up' ? (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="var(--gold)" aria-hidden>
            <path d="M12 3l2.3 5.6L20 9.2l-4.3 3.9L17 19l-5-3-5 3 1.3-5.9L4 9.2l5.7-.6z" />
          </svg>
        ) : (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--purple-soft)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M12 5v14M6 13l6 6 6-6" />
          </svg>
        )}
        <h3 style={{ fontSize: 15 }}>{title}</h3>
      </div>
      <div className="stack" style={{ gap: 8 }}>
        {dims.map((k) => (
          <div key={k} className="row between">
            <span
              className="row gap-sm"
              style={{ fontSize: 13.5, fontWeight: 500 }}
            >
              <span
                style={{
                  display: 'grid',
                  placeItems: 'center',
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: `color-mix(in srgb, ${DIMS[k].color} 15%, white)`,
                }}
              >
                <DimIcon dim={k} size={15} color={DIMS[k].color} />
              </span>
              {DIMS[k].labelTh}
            </span>
            <span
              className="mono"
              style={{ fontSize: 13, fontWeight: 600, color: DIMS[k].color }}
            >
              {totals[k]}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
