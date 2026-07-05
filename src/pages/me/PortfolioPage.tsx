import { Link, useParams } from 'react-router-dom'
import { useLive } from '../../store'
import { buildTranscript } from '../../store/views'
import { Radar } from '../../components/Radar'
import { IdentityLadder } from '../../components/IdentityLadder'
import { IdentityBadge } from '../../components/IdentityBadge'
import { SunburstWheel } from '../../components/SunburstWheel'
import { Avatar } from '../../components/common'
import { DimIcon } from '../../components/DimIcon'
import { DIMS } from '../../theme'
import { DOMAINS } from '../../lib/taxonomy'
import { rankDims } from '../../lib/compute'
import { formatDateTh, fullName } from '../../lib/format'

export function PortfolioPage() {
  const { studentId } = useParams()
  const tr = useLive(
    (s) => {
      try {
        return studentId ? buildTranscript(s, studentId) : null
      } catch {
        return null
      }
    },
    [studentId],
  )

  if (!tr) {
    return (
      <div className="empty">
        ไม่พบนิสิต · <Link to="/me">เลือกนิสิตใหม่</Link>
      </div>
    )
  }

  const st = tr.student
  const topDomains = rankDims(tr.totals)
    .filter((k) => tr.totals[k] > 0)
    .slice(0, 3)

  return (
    <div className="portfolio-wrap">
      {/* แถบเครื่องมือ (ไม่พิมพ์) */}
      <div className="no-print row between wrap" style={{ gap: 10, marginBottom: 16 }}>
        <Link to={`/me/${st.id}`} className="btn btn-ghost btn-sm">
          ← กลับทรานสคริปต์
        </Link>
        <button className="btn btn-primary" onClick={() => window.print()}>
          พิมพ์ / บันทึกเป็น PDF
        </button>
      </div>

      {/* ── แผ่น A4 ── */}
      <div className="portfolio-sheet">
        {/* header */}
        <div className="pf-head">
          <div className="row gap-sm">
            <Avatar student={st} size={54} />
            <div>
              <div className="pf-eyebrow">BCA Skill Transcript · Portfolio</div>
              <div className="pf-name">{fullName(st)}</div>
              <div className="pf-sub mono">
                {st.studentCode} · {st.major} · ปี {st.year}
              </div>
            </div>
          </div>
          <div className="pf-logo">
            <div className="pf-logo-mark">BCA</div>
            <div className="pf-sub">มหาวิทยาลัยพะเยา</div>
          </div>
        </div>

        {/* radar + identity */}
        <div className="pf-grid2">
          <div className="pf-box center">
            <div className="pf-boxtitle">เรดาร์สมรรถนะ 7 โดเมน</div>
            <Radar values={tr.totals} max={tr.axisMax} size={280} animate={false} />
          </div>
          <div className="pf-box">
            <div className="pf-boxtitle center">BCA Identity</div>
            <IdentityBadge level={tr.identityLevel} score={tr.identityScore} size={128} />
            <div style={{ marginTop: 10 }}>
              <IdentityLadder level={tr.identityLevel} compact />
            </div>
          </div>
        </div>

        {/* จุดเด่น competency */}
        <div className="pf-box">
          <div className="pf-boxtitle">จุดเด่น Competency</div>
          <div className="pf-comp">
            {topDomains.length === 0 && (
              <span className="faint" style={{ fontSize: 12 }}>
                ยังไม่มีข้อมูลคะแนน
              </span>
            )}
            {topDomains.map((k) => {
              const dom = DOMAINS.find((d) => d.key === k)!
              return (
                <div key={k} className="pf-comp-item">
                  <div className="row gap-sm" style={{ marginBottom: 4 }}>
                    <DimIcon dim={k} size={16} color={DIMS[k].color} />
                    <strong style={{ fontSize: 13 }}>{DIMS[k].labelTh}</strong>
                    <span className="mono faint" style={{ fontSize: 11 }}>
                      {tr.totals[k]} แต้ม
                    </span>
                  </div>
                  <div className="row wrap" style={{ gap: 4 }}>
                    {dom.groups.flatMap((g) => g.items).map((it) => (
                      <span
                        key={it.code}
                        className="pf-code"
                        style={{
                          ['--dim' as string]: DIMS[k].color,
                        }}
                      >
                        {it.code}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* sunburst + กิจกรรม */}
        <div className="pf-grid2">
          <div className="pf-box center">
            <div className="pf-boxtitle">แผนผัง Competency (BCA)</div>
            <SunburstWheel size={260} showCodes={false} />
          </div>
          <div className="pf-box">
            <div className="pf-boxtitle">กิจกรรมที่เข้าร่วม ({tr.activities.length})</div>
            <div className="pf-acts">
              {tr.activities.map(({ participation, activity }) => (
                <div key={participation.id} className="pf-act">
                  <div className="pf-act-name">
                    {activity.identityLevel && (
                      <span className="pf-lv">LV{activity.identityLevel}</span>
                    )}
                    {activity.name}
                  </div>
                  <span className="pf-act-date mono">
                    {formatDateTh(activity.startAt)}
                  </span>
                </div>
              ))}
              {tr.activities.length === 0 && (
                <span className="faint" style={{ fontSize: 12 }}>
                  ยังไม่เข้าร่วมกิจกรรม
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="pf-foot">
          ออกโดยระบบ Skill Transcript · คณะบริหารธุรกิจและนิเทศศาสตร์ มหาวิทยาลัยพะเยา ·
          ข้อมูลจำลองเพื่อการนำเสนอ (Owl Day House)
        </div>
      </div>
    </div>
  )
}
