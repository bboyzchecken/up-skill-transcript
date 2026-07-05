import { Link, useParams } from 'react-router-dom'
import { useLive } from '../../store'
import { QRCode } from '../../components/QRCode'
import { Radar } from '../../components/Radar'
import { Avatar, StatusBadge, DimTag } from '../../components/common'
import { listParticipantsWithStudents } from '../../store/views'
import { rankDims } from '../../lib/compute'
import { formatDateTimeTh, formatTimeTh, fullName } from '../../lib/format'
import { absoluteUrl, withBase } from '../../lib/url'
import type { Dims } from '../../types'

const MAX10: Dims = {
  knowledge: 10,
  skills: 10,
  attitude: 10,
  ethics: 10,
  aesthetics: 10,
  wellness: 10,
}

export function ActivityDetail() {
  const { id } = useParams()
  const data = useLive(
    (s) => {
      const activity = s.activities.find((a) => a.id === id) ?? null
      const participants = activity
        ? listParticipantsWithStudents(s, activity.id)
        : []
      return { activity, participants }
    },
    [id],
  )

  if (!data.activity) {
    return (
      <div className="empty">
        ไม่พบกิจกรรมนี้ · <Link to="/staff">กลับรายการ</Link>
      </div>
    )
  }
  const { activity, participants } = data
  const joinUrl = absoluteUrl(`/join/${activity.joinCode}`)
  const topDims = rankDims(activity.dims).filter((k) => activity.dims[k] >= 5)

  return (
    <div>
      <div className="page-head">
        <div>
          <span className="eyebrow">
            <Link to="/staff" style={{ color: 'inherit' }}>
              ← กิจกรรมทั้งหมด
            </Link>
          </span>
          <div className="row gap-sm" style={{ marginTop: 6 }}>
            <StatusBadge status={activity.status} />
            <span className="mono faint" style={{ fontSize: 12 }}>
              {activity.code}
            </span>
          </div>
          <h1 style={{ marginTop: 8 }}>{activity.name}</h1>
          <p className="sub">
            {formatDateTimeTh(activity.startAt)} · {activity.location}
          </p>
        </div>
        <Link to={`/staff/${activity.id}/edit`} className="btn btn-outline">
          แก้ไข
        </Link>
      </div>

      <div className="section split">
        {/* ── QR + join ── */}
        <div className="card pad" style={{ textAlign: 'center' }}>
          <div className="panel-title" style={{ justifyContent: 'center' }}>
            <h3>ฉายจอให้นิสิตสแกนเข้าร่วม</h3>
          </div>
          <div style={{ display: 'grid', placeItems: 'center', gap: 16 }}>
            <QRCode text={joinUrl} size={230} />
            <div>
              <div className="muted" style={{ fontSize: 12.5 }}>
                หรือกรอกโค้ดเข้าร่วม
              </div>
              <div
                className="mono"
                style={{
                  fontSize: 34,
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  color: 'var(--purple)',
                  marginTop: 2,
                }}
              >
                {activity.joinCode}
              </div>
            </div>
            <div className="row gap-sm wrap" style={{ justifyContent: 'center' }}>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => {
                  navigator.clipboard?.writeText(joinUrl)
                }}
              >
                คัดลอกลิงก์
              </button>
              <button
                className="btn btn-gold btn-sm"
                onClick={() => window.open(withBase(`/join/${activity.joinCode}`), '_blank')}
              >
                เปิดหน้าเข้าร่วม (อีกแท็บ)
              </button>
            </div>
            <p className="faint" style={{ fontSize: 12 }}>
              เดโม่จอเดียว: เปิดอีกแท็บแล้วเข้าร่วม ชื่อจะเด้งเข้ารายการทางขวาสด ๆ
            </p>
          </div>
        </div>

        {/* ── ข้อมูล + เรดาร์ + รายชื่อ ── */}
        <div className="stack">
          <div className="card pad">
            <div className="split" style={{ gap: 16, alignItems: 'center' }}>
              <div style={{ display: 'grid', placeItems: 'center' }}>
                <Radar
                  values={activity.dims}
                  max={MAX10}
                  size={210}
                  showLabels={false}
                />
              </div>
              <div className="stack" style={{ gap: 10 }}>
                <div>
                  <div className="muted" style={{ fontSize: 12.5 }}>
                    ผู้เข้าร่วม
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 30,
                      fontWeight: 700,
                      color: 'var(--purple)',
                    }}
                  >
                    {participants.length}
                    {activity.capacity ? (
                      <span className="faint" style={{ fontSize: 15 }}>
                        {' '}
                        / {activity.capacity}
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="row wrap" style={{ gap: 6 }}>
                  {topDims.map((k) => (
                    <DimTag key={k} dim={k} />
                  ))}
                </div>
              </div>
            </div>
            {activity.description && (
              <>
                <div className="divider" />
                <p className="muted" style={{ fontSize: 13.5 }}>
                  {activity.description}
                </p>
              </>
            )}
          </div>

          <div className="card pad">
            <div className="panel-title">
              <h3>รายชื่อผู้เข้าร่วม</h3>
              <span className="hint">อัปเดตสด ({participants.length})</span>
            </div>
            {participants.length === 0 ? (
              <div className="empty">
                ยังไม่มีผู้เข้าร่วม — ให้เปิดหน้าเข้าร่วมแล้วลองสแกน
              </div>
            ) : (
              <div
                className="stack"
                style={{ gap: 8, maxHeight: 420, overflowY: 'auto' }}
              >
                {participants.map((r) => (
                  <div
                    key={r.participation.id}
                    className="row slide-in"
                    style={{
                      gap: 11,
                      padding: '8px 10px',
                      borderRadius: 12,
                      background: 'var(--surface-2)',
                      border: '1px solid var(--line)',
                    }}
                  >
                    <Avatar student={r.student} size={36} />
                    <div className="grow">
                      <div style={{ fontSize: 13.5, fontWeight: 600 }}>
                        {fullName(r.student)}
                      </div>
                      <div className="faint mono" style={{ fontSize: 11.5 }}>
                        {r.student.studentCode} · {r.student.major}
                      </div>
                    </div>
                    <span className="faint mono" style={{ fontSize: 11.5 }}>
                      {formatTimeTh(r.participation.checkinAt)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
