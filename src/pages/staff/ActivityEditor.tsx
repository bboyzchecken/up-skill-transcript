import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { getStore, useLive } from '../../store'
import { DimSliders } from '../../components/DimSlider'
import { Radar } from '../../components/Radar'
import { balanceScore } from '../../lib/compute'
import type { ActivityInput, ActivityStatus, Dims } from '../../types'
import { emptyDims } from '../../types'

const CATEGORIES = [
  'วิชาการ/ทักษะวิชาชีพ',
  'อาสา/บำเพ็ญประโยชน์',
  'ศิลปวัฒนธรรม',
  'กีฬา/สุขภาพ',
  'ปฐมนิเทศ',
]

const MAX10: Dims = {
  knowledge: 10,
  skills: 10,
  attitude: 10,
  ethics: 10,
  aesthetics: 10,
  wellness: 10,
}

function toLocalInput(iso: string): string {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}
function fromLocalInput(val: string): string {
  return new Date(val).toISOString()
}

export function ActivityEditor() {
  const { id } = useParams()
  const editing = Boolean(id)
  const nav = useNavigate()
  const existing = useLive(
    (s) => (id ? s.activities.find((a) => a.id === id) ?? null : null),
    [id],
  )

  const now = new Date()
  const in3h = new Date(now.getTime() + 3 * 3600_000)

  const [form, setForm] = useState<ActivityInput>(() => {
    if (existing) {
      return {
        name: existing.name,
        description: existing.description,
        facultyId: existing.facultyId,
        category: existing.category,
        startAt: existing.startAt,
        endAt: existing.endAt,
        location: existing.location,
        capacity: existing.capacity,
        dims: { ...existing.dims },
        status: existing.status,
      }
    }
    return {
      name: '',
      description: '',
      facultyId: 'fac-bca',
      category: CATEGORIES[0],
      startAt: now.toISOString(),
      endAt: in3h.toISOString(),
      location: '',
      capacity: undefined,
      dims: emptyDims(),
      status: 'open',
    }
  })

  const set = <K extends keyof ActivityInput>(k: K, v: ActivityInput[K]) =>
    setForm((f) => ({ ...f, [k]: v }))

  const canSave = form.name.trim().length > 1 && form.location.trim().length > 0

  const save = async () => {
    if (!canSave) return
    const store = getStore()
    if (editing && id) {
      await store.updateActivity(id, form)
      nav(`/staff/${id}`)
    } else {
      const created = await store.createActivity(form)
      nav(`/staff/${created.id}`)
    }
  }

  const balance = balanceScore(form.dims)

  return (
    <div>
      <div className="page-head">
        <div>
          <span className="eyebrow">
            <Link to="/staff" style={{ color: 'inherit' }}>
              ← กลับรายการกิจกรรม
            </Link>
          </span>
          <h1>{editing ? 'แก้ไขกิจกรรม' : 'สร้างกิจกรรมใหม่'}</h1>
        </div>
      </div>

      <div className="section split">
        {/* ── ฟอร์ม ── */}
        <div className="card pad">
          <label className="field">
            <span className="lab">
              ชื่อกิจกรรม <span className="req">*</span>
            </span>
            <input
              type="text"
              placeholder="เช่น BCA Startup Pitching Day"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
            />
          </label>

          <div className="grid-2">
            <label className="field">
              <span className="lab">หมวดกิจกรรม</span>
              <select
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span className="lab">
                สถานที่ <span className="req">*</span>
              </span>
              <input
                type="text"
                placeholder="เช่น หอประชุมพญางำเมือง"
                value={form.location}
                onChange={(e) => set('location', e.target.value)}
              />
            </label>
          </div>

          <div className="grid-2">
            <label className="field">
              <span className="lab">เริ่ม</span>
              <input
                type="datetime-local"
                value={toLocalInput(form.startAt)}
                onChange={(e) => set('startAt', fromLocalInput(e.target.value))}
              />
            </label>
            <label className="field">
              <span className="lab">สิ้นสุด</span>
              <input
                type="datetime-local"
                value={toLocalInput(form.endAt)}
                onChange={(e) => set('endAt', fromLocalInput(e.target.value))}
              />
            </label>
          </div>

          <div className="grid-2">
            <label className="field">
              <span className="lab">ความจุ (ไม่บังคับ)</span>
              <input
                type="number"
                min={0}
                placeholder="เช่น 120"
                value={form.capacity ?? ''}
                onChange={(e) =>
                  set(
                    'capacity',
                    e.target.value ? Number(e.target.value) : undefined,
                  )
                }
              />
            </label>
            <label className="field">
              <span className="lab">สถานะ</span>
              <select
                value={form.status}
                onChange={(e) =>
                  set('status', e.target.value as ActivityStatus)
                }
              >
                <option value="open">เปิดรับ</option>
                <option value="draft">ร่าง</option>
                <option value="closed">ปิดแล้ว</option>
              </select>
            </label>
          </div>

          <label className="field">
            <span className="lab">คำอธิบาย</span>
            <textarea
              placeholder="รายละเอียดกิจกรรม วัตถุประสงค์ กลุ่มเป้าหมาย…"
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
            />
          </label>
        </div>

        {/* ── คะแนน 6 ด้าน + มินิเรดาร์ ── */}
        <div className="stack">
          <div className="card pad">
            <div className="panel-title">
              <h3>ตั้งคะแนน 6 ด้าน</h3>
              <span className="hint">0–10 ต่อด้าน</span>
            </div>
            <DimSliders value={form.dims} onChange={(d) => set('dims', d)} />
          </div>

          <div className="card pad">
            <div className="panel-title">
              <h3>รูปทรงคะแนนกิจกรรม</h3>
              <span className="hint">
                สมดุล {balance}
              </span>
            </div>
            <div style={{ display: 'grid', placeItems: 'center' }}>
              <Radar values={form.dims} max={MAX10} size={280} />
            </div>
            <p className="muted center" style={{ fontSize: 12.5, marginTop: 4 }}>
              เห็นทันทีว่ากิจกรรมนี้ “ทรงไหน” ก่อนบันทึก
            </p>
          </div>
        </div>
      </div>

      <div
        className="row"
        style={{ marginTop: 20, gap: 10, justifyContent: 'flex-end' }}
      >
        <Link to="/staff" className="btn btn-ghost">
          ยกเลิก
        </Link>
        <button
          className="btn btn-primary btn-lg"
          onClick={save}
          disabled={!canSave}
        >
          {editing ? 'บันทึกการแก้ไข' : 'บันทึกและสร้าง QR'}
        </button>
      </div>
    </div>
  )
}
