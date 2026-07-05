import type { ActivityStatus, DimKey, Student } from '../types'
import { DIMS } from '../theme'
import { initials } from '../lib/format'
import { DimIcon } from './DimIcon'

export function Avatar({
  student,
  size = 38,
}: {
  student: Pick<Student, 'firstName' | 'lastName' | 'avatarHue'>
  size?: number
}) {
  const hue = student.avatarHue
  return (
    <div
      className="avatar"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.36,
        background: `linear-gradient(140deg, hsl(${hue} 52% 58%), hsl(${(hue + 40) % 360} 55% 42%))`,
      }}
    >
      {initials(student)}
    </div>
  )
}

export function StatusBadge({ status }: { status: ActivityStatus }) {
  if (status === 'open')
    return (
      <span className="status status-open">
        <span className="dot" />
        เปิดรับ
      </span>
    )
  if (status === 'draft')
    return <span className="status status-draft">ร่าง</span>
  return <span className="status status-closed">ปิดแล้ว</span>
}

export function DimTag({
  dim,
  showIcon = true,
}: {
  dim: DimKey
  showIcon?: boolean
}) {
  const meta = DIMS[dim]
  return (
    <span
      className="tag tag-dim"
      style={{ ['--dim' as string]: meta.color }}
    >
      {showIcon ? (
        <DimIcon dim={dim} size={13} color={meta.color} />
      ) : (
        <span className="dot" style={{ background: meta.color }} />
      )}
      {meta.labelTh}
    </span>
  )
}
