import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getStore, useLive } from '../../store'
import { Radar } from '../../components/Radar'
import { Avatar, DimTag } from '../../components/common'
import { DimIcon } from '../../components/DimIcon'
import { DIMS } from '../../theme'
import { MAX10, rankDims } from '../../lib/compute'
import { formatDateTh, fullName } from '../../lib/format'
import type { Participation } from '../../types'

export function JoinPage() {
  const params = useParams()
  const [code, setCode] = useState((params.code ?? '').toUpperCase())
  const [typed, setTyped] = useState('')
  const [studentId, setStudentId] = useState('')
  const [query, setQuery] = useState('')
  const [done, setDone] = useState<Participation | null>(null)

  const data = useLive(
    (s) => {
      const activity = code
        ? s.activities.find(
            (a) => a.joinCode.toUpperCase() === code.toUpperCase(),
          ) ?? null
        : null
      const openActivities = s.activities.filter((a) => a.status === 'open')
      const q = query.trim().toLowerCase()
      const results = q
        ? s.students
            .filter(
              (st) =>
                `${st.firstName} ${st.lastName}`.toLowerCase().includes(q) ||
                st.studentCode.includes(q),
            )
            .slice(0, 6)
        : []
      const selected = studentId
        ? s.students.find((st) => st.id === studentId) ?? null
        : null
      return { activity, openActivities, results, selected }
    },
    [code, query, studentId],
  )

  const wrap: React.CSSProperties = {
    maxWidth: 460,
    margin: '0 auto',
  }

  // ── สำเร็จ ──
  if (done && data.activity && data.selected) {
    const act = data.activity
    const topDims = rankDims(act.dims).filter((k) => act.dims[k] >= 4)
    return (
      <div style={wrap}>
        <div className="card pad pop-in" style={{ textAlign: 'center' }}>
          <div
            style={{
              width: 68,
              height: 68,
              margin: '4px auto 12px',
              borderRadius: '50%',
              display: 'grid',
              placeItems: 'center',
              background: 'linear-gradient(140deg, var(--gold-soft), var(--gold))',
            }}
          >
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#3a2c05" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12l5 5L20 6" />
            </svg>
          </div>
          <h2 style={{ fontSize: 22 }}>เข้าร่วมสำเร็จ!</h2>
          <p className="muted" style={{ marginTop: 4, fontSize: 14 }}>
            {fullName(data.selected)} · {act.name}
          </p>

          <div className="divider" />
          <div className="muted" style={{ fontSize: 13, marginBottom: 8 }}>
            กิจกรรมนี้เติมให้คุณ
          </div>
          <div style={{ display: 'grid', placeItems: 'center' }}>
            <Radar values={act.dims} max={MAX10} size={230} />
          </div>
          <div
            className="row wrap"
            style={{ gap: 6, justifyContent: 'center', marginTop: 8 }}
          >
            {topDims.map((k) => (
              <span
                key={k}
                className="tag tag-dim"
                style={{ ['--dim' as string]: DIMS[k].color }}
              >
                <DimIcon dim={k} size={13} color={DIMS[k].color} />
                {DIMS[k].labelTh} +{act.dims[k]}
              </span>
            ))}
          </div>

          <div className="stack" style={{ marginTop: 20, gap: 8 }}>
            <Link
              to={`/me/${data.selected.id}`}
              className="btn btn-primary btn-block btn-lg"
            >
              ดูทรานสคริปต์ของฉัน →
            </Link>
            <button
              className="btn btn-ghost btn-block"
              onClick={() => {
                setDone(null)
                setStudentId('')
                setQuery('')
                setCode('')
                setTyped('')
              }}
            >
              เข้าร่วมกิจกรรมอื่น
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── ยังไม่มีกิจกรรม: กรอกโค้ด / เลือกจากที่เปิดอยู่ ──
  if (!data.activity) {
    return (
      <div style={wrap}>
        <div className="center" style={{ marginBottom: 18 }}>
          <span className="eyebrow">แอปนิสิต · เข้าร่วมกิจกรรม</span>
          <h1 style={{ fontSize: 24, marginTop: 6 }}>สแกนหรือกรอกโค้ด</h1>
          <p className="muted" style={{ fontSize: 13.5, marginTop: 4 }}>
            รับโค้ด 6 หลักจากหน้าจอที่เจ้าหน้าที่ฉาย
          </p>
        </div>

        <div className="card pad">
          <div className="row gap-sm">
            <input
              type="text"
              placeholder="เช่น PITCH26"
              value={typed}
              onChange={(e) => setTyped(e.target.value.toUpperCase())}
              onKeyDown={(e) => {
                if (e.key === 'Enter') setCode(typed.trim())
              }}
              className="mono"
              style={{ fontSize: 18, letterSpacing: '0.1em', textAlign: 'center' }}
            />
            <button
              className="btn btn-primary"
              onClick={() => setCode(typed.trim())}
              disabled={typed.trim().length < 3}
            >
              เข้าร่วม
            </button>
          </div>
          {code && !data.activity && (
            <p style={{ color: 'var(--danger)', fontSize: 12.5, marginTop: 8 }}>
              ไม่พบกิจกรรมสำหรับโค้ด “{code}”
            </p>
          )}
        </div>

        {data.openActivities.length > 0 && (
          <div className="section">
            <div className="muted" style={{ fontSize: 12.5, marginBottom: 8 }}>
              หรือเลือกกิจกรรมที่กำลังเปิดรับ
            </div>
            <div className="stack" style={{ gap: 8 }}>
              {data.openActivities.map((a) => (
                <button
                  key={a.id}
                  className="card pad hoverable row between"
                  style={{ textAlign: 'left', cursor: 'pointer', border: '1px solid var(--line)' }}
                  onClick={() => setCode(a.joinCode)}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14.5 }}>{a.name}</div>
                    <div className="faint" style={{ fontSize: 12 }}>
                      {formatDateTh(a.startAt)} · {a.location}
                    </div>
                  </div>
                  <span className="tag mono">{a.joinCode}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  // ── มีกิจกรรมแล้ว: เลือกตัวตน + ยืนยัน ──
  const act = data.activity
  return (
    <div style={wrap}>
      <div className="center" style={{ marginBottom: 4 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => setCode('')}>
          ← เปลี่ยนกิจกรรม
        </button>
      </div>
      <div className="card pad">
        <span className="tag">{act.category}</span>
        <h2 style={{ fontSize: 20, marginTop: 10 }}>{act.name}</h2>
        <p className="muted" style={{ fontSize: 13, marginTop: 4 }}>
          {formatDateTh(act.startAt)} · {act.location}
        </p>
        <div className="row wrap" style={{ gap: 6, marginTop: 12 }}>
          {rankDims(act.dims)
            .filter((k) => act.dims[k] >= 5)
            .map((k) => (
              <DimTag key={k} dim={k} />
            ))}
        </div>
      </div>

      <div className="card pad section">
        <div className="lab" style={{ marginBottom: 8, fontWeight: 600 }}>
          เลือกว่าคุณเป็นใคร <span className="req">*</span>
        </div>

        {data.selected ? (
          <div
            className="row between"
            style={{
              padding: '10px 12px',
              borderRadius: 12,
              background: 'var(--purple-tint)',
            }}
          >
            <div className="row gap-sm">
              <Avatar student={data.selected} size={40} />
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>
                  {fullName(data.selected)}
                </div>
                <div className="faint mono" style={{ fontSize: 11.5 }}>
                  {data.selected.studentCode} · {data.selected.major}
                </div>
              </div>
            </div>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => {
                setStudentId('')
                setQuery('')
              }}
            >
              เปลี่ยน
            </button>
          </div>
        ) : (
          <>
            <input
              type="search"
              placeholder="ค้นหาชื่อหรือรหัสนิสิต…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
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
                    onClick={() => setStudentId(st.id)}
                  >
                    <Avatar student={st} size={34} />
                    <div className="grow">
                      <div style={{ fontSize: 13.5, fontWeight: 600 }}>
                        {fullName(st)}
                      </div>
                      <div className="faint mono" style={{ fontSize: 11 }}>
                        {st.studentCode} · {st.major}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
            {query && data.results.length === 0 && (
              <p className="faint" style={{ fontSize: 12.5, marginTop: 8 }}>
                ไม่พบนิสิตที่ตรงกับ “{query}”
              </p>
            )}
          </>
        )}

        <button
          className="btn btn-primary btn-block btn-lg"
          style={{ marginTop: 16 }}
          disabled={!data.selected}
          onClick={async () => {
            if (!data.selected) return
            const p = await getStore().join(act.id, data.selected.id)
            setDone(p)
          }}
        >
          ยืนยันเข้าร่วม
        </button>
      </div>

      <p className="faint center" style={{ fontSize: 11.5, marginTop: 10 }}>
        เดโม่ไม่มีการล็อกอินจริง — เลือกตัวตนเพื่อจำลอง SSO ของมหาวิทยาลัย
      </p>
    </div>
  )
}
