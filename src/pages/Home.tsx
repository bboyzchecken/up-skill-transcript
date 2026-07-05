import { Link } from 'react-router-dom'
import { ConstellationBg } from '../components/ConstellationBg'
import { Radar } from '../components/Radar'
import { useLive } from '../store'
import { buildDashboard } from '../store/views'
import { DIM_LIST } from '../theme'
import { DimIcon } from '../components/DimIcon'

const ROLES = [
  {
    to: '/staff',
    title: 'เจ้าหน้าที่ / คณะ',
    desc: 'สร้างกิจกรรม ตั้งคะแนน 6 ด้าน ดูผู้เข้าร่วมแบบเรียลไทม์',
    tag: 'organizer',
  },
  {
    to: '/join',
    title: 'นิสิต · เข้าร่วม',
    desc: 'สแกน QR หรือกรอกโค้ด เลือกตัวตน ยืนยันเข้าร่วมในไม่กี่วินาที',
    tag: 'student',
  },
  {
    to: '/me',
    title: 'ทรานสคริปต์ของฉัน',
    desc: 'เรดาร์ 6 แกน จุดเด่น/ควรเสริม และฉายาประจำตัว',
    tag: 'transcript',
  },
  {
    to: '/dashboard',
    title: 'กองกิจการนิสิต',
    desc: 'ภาพรวมทั้งคณะ กราฟ ค้นหานิสิต และด้านที่ควรจัดเพิ่ม',
    tag: 'dashboard',
  },
]

export function Home() {
  const stats = useLive((s) => buildDashboard(s))
  // เรดาร์ตัวอย่างในหน้าแรก (ค่าคงที่สวย ๆ)
  const demoVals = {
    knowledge: 8,
    skills: 9,
    attitude: 7,
    ethics: 6,
    aesthetics: 5,
    wellness: 7,
  }
  const demoMax = {
    knowledge: 10,
    skills: 10,
    attitude: 10,
    ethics: 10,
    aesthetics: 10,
    wellness: 10,
  }

  return (
    <div>
      <section className="hero">
        <ConstellationBg />
        <div className="split-wide" style={{ position: 'relative' }}>
          <div>
            <span
              className="mono"
              style={{
                fontSize: 12,
                letterSpacing: '0.16em',
                color: 'var(--gold-soft)',
                textTransform: 'uppercase',
              }}
            >
              Skill Transcript System
            </span>
            <h1 style={{ fontSize: 38, marginTop: 12, lineHeight: 1.15 }}>
              ทรานสคริปต์ทักษะ
              <br />
              ที่เล่าเรื่องนิสิตได้ทั้งคน
            </h1>
            <p
              style={{
                marginTop: 16,
                fontSize: 15.5,
                color: 'rgba(255,255,255,0.82)',
                maxWidth: '54ch',
              }}
            >
              ทุกกิจกรรมของคณะบริหารธุรกิจและนิเทศศาสตร์ให้คะแนน{' '}
              <strong style={{ color: '#fff' }}>6 ด้าน</strong> —
              สะสมเป็นเรดาร์ใยแมงมุมที่บอกว่านิสิตคนนี้เด่นด้านไหน
              และมหาวิทยาลัยควรเติมด้านใด
            </p>
            <div className="row wrap" style={{ marginTop: 24, gap: 10 }}>
              <Link to="/staff" className="btn btn-gold btn-lg">
                เริ่มฝั่งเจ้าหน้าที่
              </Link>
              <Link
                to="/me"
                className="btn btn-lg btn-outline"
                style={{
                  background: 'transparent',
                  color: '#fff',
                  borderColor: 'rgba(255,255,255,0.4)',
                }}
              >
                ดูตัวอย่างทรานสคริปต์
              </Link>
            </div>
          </div>
          <div
            style={{
              display: 'grid',
              placeItems: 'center',
              background: 'rgba(255,255,255,0.06)',
              borderRadius: 'var(--r-lg)',
              padding: 8,
            }}
          >
            <div style={{ filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.3))' }}>
              <Radar values={demoVals} max={demoMax} size={300} />
            </div>
          </div>
        </div>
      </section>

      {/* 6 ด้าน strip */}
      <section className="section">
        <div className="row wrap" style={{ gap: 10, justifyContent: 'center' }}>
          {DIM_LIST.map((d) => (
            <div
              key={d.key}
              className="tag tag-dim"
              style={{ ['--dim' as string]: d.color, padding: '7px 14px', fontSize: 13 }}
            >
              <DimIcon dim={d.key} size={15} color={d.color} />
              {d.labelTh}
            </div>
          ))}
        </div>
      </section>

      {/* role cards */}
      <section className="section">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
            gap: 16,
          }}
        >
          {ROLES.map((r) => (
            <Link
              key={r.to}
              to={r.to}
              className="card pad hoverable"
              style={{ display: 'block' }}
            >
              <span
                className="mono"
                style={{
                  fontSize: 11,
                  color: 'var(--purple-soft)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                }}
              >
                {r.tag}
              </span>
              <h3 style={{ marginTop: 8, fontSize: 18 }}>{r.title}</h3>
              <p className="muted" style={{ marginTop: 8, fontSize: 13.5 }}>
                {r.desc}
              </p>
              <span
                style={{
                  display: 'inline-block',
                  marginTop: 14,
                  color: 'var(--purple)',
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                เข้าใช้งาน →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* quick stats */}
      <section className="section">
        <div className="card pad">
          <div className="row wrap between">
            <div>
              <span className="muted" style={{ fontSize: 13 }}>
                ข้อมูลในระบบตอนนี้
              </span>
              <div
                className="row wrap"
                style={{ gap: 26, marginTop: 10, fontFamily: 'var(--font-display)' }}
              >
                <Stat n={stats.totalStudents} label="นิสิต" />
                <Stat n={stats.totalActivities} label="กิจกรรม" />
                <Stat n={stats.totalCheckins} label="การเข้าร่วม" />
                <Stat n={stats.avgActivitiesPerStudent} label="เฉลี่ย/คน" />
              </div>
            </div>
            <Link to="/dashboard" className="btn btn-outline">
              ดู dashboard เต็ม →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div>
      <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--purple)' }}>
        {n.toLocaleString('th-TH')}
      </div>
      <div className="faint" style={{ fontSize: 12.5, fontFamily: 'var(--font-body)' }}>
        {label}
      </div>
    </div>
  )
}
