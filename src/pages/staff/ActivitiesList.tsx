import { Link } from 'react-router-dom'
import { useLive } from '../../store'
import { StatusBadge } from '../../components/common'
import { DimIcon } from '../../components/DimIcon'
import { DIMS } from '../../theme'
import { formatDateTh } from '../../lib/format'
import { rankDims } from '../../lib/compute'
import type { Activity } from '../../types'

export function ActivitiesList() {
  const data = useLive((s) => {
    const counts = new Map<string, number>()
    for (const p of s.participations)
      counts.set(p.activityId, (counts.get(p.activityId) ?? 0) + 1)
    const activities = [...s.activities].sort((a, b) =>
      b.startAt.localeCompare(a.startAt),
    )
    return activities.map((a) => ({ activity: a, count: counts.get(a.id) ?? 0 }))
  })

  return (
    <div>
      <div className="page-head">
        <div>
          <span className="eyebrow">Organizer · เจ้าหน้าที่</span>
          <h1>กิจกรรมของคณะ BCA</h1>
          <p className="sub">
            สร้างและจัดการกิจกรรม ตั้งน้ำหนักคะแนน 7 โดเมน + ระดับ Identity และดูผู้เข้าร่วมสด
          </p>
        </div>
        <Link to="/staff/new" className="btn btn-primary btn-lg">
          + สร้างกิจกรรม
        </Link>
      </div>

      <div
        className="section"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 16,
        }}
      >
        {data.map(({ activity, count }) => (
          <ActivityCard key={activity.id} activity={activity} count={count} />
        ))}
      </div>
    </div>
  )
}

function ActivityCard({
  activity,
  count,
}: {
  activity: Activity
  count: number
}) {
  const topDims = rankDims(activity.dims)
    .filter((k) => activity.dims[k] >= 5)
    .slice(0, 3)
  return (
    <Link
      to={`/staff/${activity.id}`}
      className="card pad hoverable"
      style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
    >
      <div className="row between" style={{ alignItems: 'flex-start' }}>
        <StatusBadge status={activity.status} />
        <span className="mono faint" style={{ fontSize: 11.5 }}>
          {activity.code}
        </span>
      </div>
      <h3 style={{ fontSize: 16.5, lineHeight: 1.3 }}>{activity.name}</h3>
      <div className="row wrap" style={{ gap: 6 }}>
        {topDims.map((k) => (
          <span
            key={k}
            className="tag tag-dim"
            style={{ ['--dim' as string]: DIMS[k].color, fontSize: 11.5 }}
          >
            <DimIcon dim={k} size={12} color={DIMS[k].color} />
            {DIMS[k].labelTh}
          </span>
        ))}
      </div>
      <div className="divider" style={{ margin: '2px 0' }} />
      <div className="row between faint" style={{ fontSize: 12.5 }}>
        <span>{formatDateTh(activity.startAt)} · {activity.location}</span>
      </div>
      <div className="row between" style={{ marginTop: 2 }}>
        <span className="row gap-sm" style={{ fontSize: 13 }}>
          <strong style={{ color: 'var(--purple)', fontSize: 16 }}>
            {count}
          </strong>
          <span className="muted">คนเข้าร่วม</span>
        </span>
        <span className="tag mono" style={{ fontSize: 12 }}>
          {activity.joinCode}
        </span>
      </div>
    </Link>
  )
}
