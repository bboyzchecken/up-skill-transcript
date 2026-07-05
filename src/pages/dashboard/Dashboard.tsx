import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLive } from '../../store'
import {
  buildDashboard,
  buildIdentityRanking,
  buildMajorRadar,
} from '../../store/views'
import { CountUp } from '../../components/CountUp'
import { BarList, LineChart } from '../../components/Charts'
import { Radar } from '../../components/Radar'
import { SunburstWheel } from '../../components/SunburstWheel'
import { Avatar } from '../../components/common'
import { DimIcon } from '../../components/DimIcon'
import { DIMS } from '../../theme'
import { DIM_KEYS, emptyDims } from '../../types'
import { rankDims, sumDims, totalOf } from '../../lib/compute'
import { rungOf } from '../../lib/taxonomy'
import { fullName } from '../../lib/format'
import type { DimKey, Dims, MajorCode } from '../../types'

type Tab = 'overview' | 'students' | 'identity' | 'analytics'

export function Dashboard() {
  const [tab, setTab] = useState<Tab>('overview')
  return (
    <div>
      <div className="page-head">
        <div>
          <span className="eyebrow">Student Affairs · กองกิจการนิสิต</span>
          <h1>ภาพรวมการพัฒนานิสิต คณะ BCA</h1>
          <p className="sub">
            ติดตามการมีส่วนร่วม สมรรถนะ 7 โดเมน ระดับ BCA Identity ราย­สาขา และด้านที่คณะควรจัดเพิ่ม
          </p>
        </div>
      </div>

      <div className="section">
        <div className="pill-nav">
          <button
            className={tab === 'overview' ? 'active' : ''}
            onClick={() => setTab('overview')}
          >
            ภาพรวม
          </button>
          <button
            className={tab === 'students' ? 'active' : ''}
            onClick={() => setTab('students')}
          >
            ตารางนิสิต
          </button>
          <button
            className={tab === 'identity' ? 'active' : ''}
            onClick={() => setTab('identity')}
          >
            BCA Identity
          </button>
          <button
            className={tab === 'analytics' ? 'active' : ''}
            onClick={() => setTab('analytics')}
          >
            วิเคราะห์กิจกรรม
          </button>
        </div>
      </div>

      {tab === 'overview' && <Overview />}
      {tab === 'students' && <StudentsTable />}
      {tab === 'identity' && <IdentityAnalytics />}
      {tab === 'analytics' && <Analytics />}
    </div>
  )
}

// ── ภาพรวม ──
function Overview() {
  const stats = useLive((s) => buildDashboard(s))
  const kpis = [
    {
      label: 'นิสิตที่มีส่วนร่วม',
      value: stats.activeStudents,
      sub: `จากทั้งหมด ${stats.totalStudents} คน`,
      accent: 'var(--purple)',
    },
    {
      label: 'กิจกรรมทั้งหมด',
      value: stats.totalActivities,
      sub: `เปิดรับอยู่ ${stats.openActivities} กิจกรรม`,
      accent: '#3B82F6',
    },
    {
      label: 'การเข้าร่วมรวม',
      value: stats.totalCheckins,
      sub: 'เช็กอินสะสม',
      accent: '#10B981',
    },
    {
      label: 'เฉลี่ยกิจกรรม/คน',
      value: stats.avgActivitiesPerStudent,
      sub: 'ต่อนิสิต 1 คน',
      accent: 'var(--gold)',
      decimals: 1,
    },
  ]

  return (
    <div className="section stack" style={{ gap: 20 }}>
      <div className="kpi-grid">
        {kpis.map((k) => (
          <div key={k.label} className="kpi" style={{ ['--accent' as string]: k.accent }}>
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value">
              <CountUp value={k.value} decimals={k.decimals ?? 0} />
            </div>
            <div className="kpi-sub">{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="split-wide">
        <div className="card pad">
          <div className="panel-title">
            <h3>การเข้าร่วมตามช่วงเวลา</h3>
            <span className="hint">รายเดือน (ปีการศึกษา 2568)</span>
          </div>
          <LineChart data={stats.timeline} />
        </div>
        <div className="card pad">
          <div className="panel-title">
            <h3>กิจกรรมยอดนิยม</h3>
          </div>
          <BarList
            items={stats.popularActivities.map((p) => ({
              label: p.activity.name,
              value: p.count,
            }))}
            unit=" คน"
          />
        </div>
      </div>

      <div className="split">
        <DimDistribution stats={stats} />
        <div className="card pad">
          <div className="panel-title">
            <h3>การเข้าร่วมแยกตามสาขา</h3>
          </div>
          <BarList
            items={stats.byMajor.map((m) => ({
              label: m.major,
              value: m.checkins,
              sub: `${m.students} คน`,
            }))}
            unit=" ครั้ง"
          />
        </div>
      </div>

      <div className="card pad">
        <div className="panel-title">
          <h3>การเข้าร่วมแยกตามชั้นปี</h3>
        </div>
        <div className="kpi-grid">
          {stats.byYear.map((y) => (
            <div key={y.year} className="center" style={{ padding: 8 }}>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 26,
                  fontWeight: 700,
                  color: 'var(--purple)',
                }}
              >
                {y.checkins}
              </div>
              <div className="muted" style={{ fontSize: 12.5 }}>
                ชั้นปี {y.year} · {y.students} คน
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function DimDistribution({
  stats,
}: {
  stats: ReturnType<typeof buildDashboard>
}) {
  const maxOffered = Math.max(...stats.dimDistribution.map((d) => d.offered), 1)
  return (
    <div className="card pad">
      <div className="panel-title">
        <h3>การกระจาย 7 โดเมนทั้งคณะ</h3>
        <span className="hint">แต้มที่กิจกรรมเปิดให้</span>
      </div>
      <div className="stack" style={{ gap: 10 }}>
        {stats.dimDistribution.map((d) => {
          const under = stats.underServed.includes(d.key)
          return (
            <div key={d.key}>
              <div className="row between" style={{ marginBottom: 4 }}>
                <span className="row gap-sm" style={{ fontSize: 13 }}>
                  <DimIcon dim={d.key} size={15} color={DIMS[d.key].color} />
                  {DIMS[d.key].labelTh}
                  {under && (
                    <span
                      className="tag"
                      style={{
                        fontSize: 10.5,
                        background: '#fff4e0',
                        color: '#9a6a09',
                        padding: '1px 7px',
                      }}
                    >
                      จัดน้อย
                    </span>
                  )}
                </span>
                <span className="mono faint" style={{ fontSize: 12 }}>
                  {d.activityCount} กิจกรรม
                </span>
              </div>
              <div style={{ height: 8, background: 'var(--purple-tint)', borderRadius: 999 }}>
                <div
                  style={{
                    width: `${(d.offered / maxOffered) * 100}%`,
                    height: '100%',
                    background: DIMS[d.key].color,
                    borderRadius: 999,
                    opacity: under ? 0.55 : 1,
                    transition: 'width 0.6s ease',
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── ตารางนิสิต ──
function StudentsTable() {
  const nav = useNavigate()
  const [query, setQuery] = useState('')
  const rows = useLive(
    (s) => {
      const q = query.trim().toLowerCase()
      return s.students
        .map((st) => {
          const parts = s.participations.filter((p) => p.studentId === st.id)
          const totals = sumDims(parts.map((p) => p.dimsSnapshot))
          return {
            student: st,
            count: parts.length,
            topDim: rankDims(totals)[0] as DimKey,
            total: totalOf(totals),
          }
        })
        .filter(
          (r) =>
            !q ||
            `${r.student.firstName} ${r.student.lastName}`
              .toLowerCase()
              .includes(q) ||
            r.student.studentCode.includes(q) ||
            r.student.major.toLowerCase().includes(q),
        )
        .sort((a, b) => b.count - a.count)
    },
    [query],
  )

  return (
    <div className="section">
      <div className="card pad">
        <div className="panel-title">
          <h3>นิสิตทั้งหมด ({rows.length})</h3>
          <input
            type="search"
            placeholder="ค้นหาชื่อ / รหัส / สาขา…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ maxWidth: 260 }}
          />
        </div>
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>นิสิต</th>
                <th>รหัส</th>
                <th>สาขา</th>
                <th>ปี</th>
                <th>กิจกรรม</th>
                <th>ถนัดสุด</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.student.id}
                  className="clickable"
                  onClick={() => nav(`/me/${r.student.id}`)}
                >
                  <td>
                    <div className="row gap-sm">
                      <Avatar student={r.student} size={32} />
                      <span style={{ fontWeight: 600 }}>
                        {fullName(r.student)}
                      </span>
                    </div>
                  </td>
                  <td className="mono faint">{r.student.studentCode}</td>
                  <td>{r.student.major}</td>
                  <td>{r.student.year}</td>
                  <td>
                    <strong style={{ color: 'var(--purple)' }}>{r.count}</strong>
                  </td>
                  <td>
                    <span className="row gap-sm" style={{ fontSize: 12.5 }}>
                      <DimIcon
                        dim={r.topDim}
                        size={14}
                        color={DIMS[r.topDim].color}
                      />
                      {DIMS[r.topDim].labelTh}
                    </span>
                  </td>
                  <td style={{ color: 'var(--purple-soft)', fontWeight: 600 }}>
                    →
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ── BCA Identity (เรดาร์ราย­สาขา + ตารางจัดอันดับ + การกระจายระดับ) ──
const LEVEL_COLORS = [
  '#c9c2d6', // 0
  '#b79ad6',
  '#9a6fce',
  '#7a4ba8', // intra
  '#4fb0e0',
  '#2b93cf',
  '#0d6ea0', // entre
]

function IdentityAnalytics() {
  const data = useLive((s) => {
    const ranking = buildIdentityRanking(s)
    const radars: Record<string, Dims> = {}
    for (const r of ranking) radars[r.majorCode] = buildMajorRadar(s, r.majorCode)
    return { ranking, radars }
  })
  const [major, setMajor] = useState<MajorCode>(
    data.ranking[0]?.majorCode ?? 'ComM',
  )
  const selected = data.ranking.find((r) => r.majorCode === major) ?? data.ranking[0]

  // axisMax = สูงสุดต่อแกนข้ามทุกสาขา (ให้รูปทรงเรดาร์เทียบกันได้)
  const axisMax = emptyDims()
  for (const k of DIM_KEYS) {
    let m = 1
    for (const r of data.ranking) m = Math.max(m, data.radars[r.majorCode][k])
    axisMax[k] = m
  }

  return (
    <div className="section stack" style={{ gap: 20 }}>
      {/* ตารางจัดอันดับ Identity% */}
      <div className="card pad">
        <div className="panel-title">
          <h3>ผลการวิเคราะห์ข้อมูล · Identity% จัดอันดับตามสาขา</h3>
          <span className="hint">434 คน · 8 สาขา</span>
        </div>
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>อันดับ</th>
                <th>สาขา</th>
                <th>รหัส</th>
                <th>จำนวน</th>
                <th style={{ minWidth: 200 }}>Identity%</th>
              </tr>
            </thead>
            <tbody>
              {data.ranking.map((r, i) => (
                <tr
                  key={r.majorCode}
                  className="clickable"
                  onClick={() => setMajor(r.majorCode)}
                  style={
                    r.majorCode === major
                      ? { background: 'var(--purple-tint)' }
                      : undefined
                  }
                >
                  <td>
                    <strong style={{ color: 'var(--purple)' }}>{i + 1}</strong>
                  </td>
                  <td style={{ fontWeight: 600 }}>{r.name}</td>
                  <td className="mono faint">{r.majorCode}</td>
                  <td className="mono">{r.n}</td>
                  <td>
                    <div className="row gap-sm">
                      <div
                        style={{
                          flex: 1,
                          height: 9,
                          borderRadius: 999,
                          background: 'var(--purple-tint)',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${r.identityPct}%`,
                            height: '100%',
                            borderRadius: 999,
                            background:
                              'linear-gradient(90deg, var(--purple-soft), var(--purple))',
                          }}
                        />
                      </div>
                      <span
                        className="mono"
                        style={{ fontWeight: 700, color: 'var(--purple)', width: 42, textAlign: 'right' }}
                      >
                        {r.identityPct}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="split">
        {/* เรดาร์ราย­สาขา */}
        <div className="card pad center">
          <div className="panel-title" style={{ width: '100%' }}>
            <h3>เรดาร์เฉลี่ย 7 โดเมน</h3>
            <select
              value={major}
              onChange={(e) => setMajor(e.target.value as MajorCode)}
              style={{ maxWidth: 200 }}
            >
              {data.ranking.map((r) => (
                <option key={r.majorCode} value={r.majorCode}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
          {selected && (
            <>
              <div
                className="mono"
                style={{
                  letterSpacing: '0.14em',
                  color: 'var(--purple-soft)',
                  fontSize: 12,
                  textTransform: 'uppercase',
                  marginBottom: 4,
                }}
              >
                {selected.name} · n={selected.n}
              </div>
              <Radar values={data.radars[major]} max={axisMax} size={330} />
            </>
          )}
        </div>

        {/* การกระจายระดับ Identity ของสาขา */}
        <div className="card pad">
          <div className="panel-title">
            <h3>การกระจายระดับ Identity</h3>
            <span className="hint">{selected?.name}</span>
          </div>
          {selected && (
            <div className="stack" style={{ gap: 9 }}>
              {[6, 5, 4, 3, 2, 1].map((lv) => {
                const count = selected.levelCounts[lv]
                const pct = selected.n ? (count / selected.n) * 100 : 0
                const rung = rungOf(lv)!
                return (
                  <div key={lv}>
                    <div className="row between" style={{ marginBottom: 3 }}>
                      <span className="row gap-sm" style={{ fontSize: 12.5 }}>
                        <span
                          className="mono"
                          style={{
                            fontWeight: 700,
                            color: '#fff',
                            background: LEVEL_COLORS[lv],
                            borderRadius: 5,
                            padding: '0 6px',
                            fontSize: 11,
                          }}
                        >
                          LV{lv}
                        </span>
                        <span className="faint" style={{ fontSize: 11.5 }}>
                          {rung.zone === 'entre' ? 'Entre' : 'Intra'} · {rung.title}
                        </span>
                      </span>
                      <span className="mono" style={{ fontSize: 12, fontWeight: 600 }}>
                        {count}
                      </span>
                    </div>
                    <div style={{ height: 8, background: 'var(--purple-tint)', borderRadius: 999 }}>
                      <div
                        style={{
                          width: `${pct}%`,
                          height: '100%',
                          borderRadius: 999,
                          background: LEVEL_COLORS[lv],
                          transition: 'width 0.5s ease',
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Sunburst competency wheel */}
      <div className="card pad center">
        <div className="panel-title" style={{ width: '100%' }}>
          <h3>แผนผัง Competency (Sunburst)</h3>
          <span className="hint">7 โดเมน → กลุ่ม → โค้ด</span>
        </div>
        <SunburstWheel size={460} />
      </div>
    </div>
  )
}

// ── วิเคราะห์กิจกรรม ──
function Analytics() {
  const stats = useLive((s) => buildDashboard(s))
  return (
    <div className="section stack" style={{ gap: 20 }}>
      <div
        className="card pad"
        style={{
          background: 'linear-gradient(135deg, #fff7e8, #fdeecf)',
          border: '1px solid #f0dca8',
        }}
      >
        <div className="row gap-sm" style={{ marginBottom: 6 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9a6a09" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3l7 3v5c0 4.2-2.9 7.7-7 9-4.1-1.3-7-4.8-7-9V6z" />
            <path d="M12 9v4M12 16h.01" />
          </svg>
          <h3 style={{ color: '#7a5407' }}>ด้านที่คณะควรจัดกิจกรรมเพิ่ม</h3>
        </div>
        <p style={{ color: '#7a5407', fontSize: 14 }}>
          จากการวิเคราะห์น้ำหนักกิจกรรมทั้งหมด พบว่าด้าน{' '}
          {stats.underServed.map((k, i) => (
            <strong key={k}>
              {i > 0 ? ' และ ' : ''}
              {DIMS[k].labelTh}
            </strong>
          ))}{' '}
          ถูกจัดกิจกรรมน้อยที่สุด — แนะนำให้เพิ่มกิจกรรมที่เสริมด้านเหล่านี้
          เพื่อให้นิสิตพัฒนารอบด้านมากขึ้น
        </p>
        <div className="row wrap" style={{ gap: 8, marginTop: 12 }}>
          {stats.underServed.map((k) => (
            <span
              key={k}
              className="tag tag-dim"
              style={{ ['--dim' as string]: DIMS[k].color, background: '#fff' }}
            >
              <DimIcon dim={k} size={14} color={DIMS[k].color} />
              {DIMS[k].labelTh}
            </span>
          ))}
        </div>
      </div>

      <div className="split">
        <DimDistribution stats={stats} />
        <div className="card pad">
          <div className="panel-title">
            <h3>ด้านที่คณะจัดมากที่สุด</h3>
          </div>
          <div className="stack" style={{ gap: 10 }}>
            {stats.overServed.map((k) => {
              const item = stats.dimDistribution.find((d) => d.key === k)!
              return (
                <div
                  key={k}
                  className="row between"
                  style={{
                    padding: '12px 14px',
                    borderRadius: 12,
                    background: `color-mix(in srgb, ${DIMS[k].color} 8%, white)`,
                    border: `1px solid color-mix(in srgb, ${DIMS[k].color} 25%, white)`,
                  }}
                >
                  <span className="row gap-sm" style={{ fontWeight: 600 }}>
                    <DimIcon dim={k} size={18} color={DIMS[k].color} />
                    {DIMS[k].labelTh}
                  </span>
                  <span className="mono" style={{ color: DIMS[k].color, fontWeight: 700 }}>
                    {item.activityCount} กิจกรรม
                  </span>
                </div>
              )
            })}
          </div>
          <div className="divider" />
          <div className="panel-title">
            <h3 style={{ fontSize: 15 }}>กิจกรรมยอดนิยม</h3>
          </div>
          <BarList
            items={stats.popularActivities.slice(0, 5).map((p) => ({
              label: p.activity.name,
              value: p.count,
            }))}
            unit=" คน"
          />
        </div>
      </div>
    </div>
  )
}
