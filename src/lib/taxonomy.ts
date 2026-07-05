import type { Domain, IdentityRung } from '../types'
import { DIMS } from '../theme'

// ─────────────────────────────────────────────────────────────
// Taxonomy competency: โดเมน → กลุ่มย่อย(prefix) → โค้ด
// ⚠️ TODO: confirm with client — โค้ดเหล่านี้ประมาณจาก PDF (Tier A / static)
// ใช้วาด sunburst wheel + แสดงจุดเด่นบน portfolio
// ─────────────────────────────────────────────────────────────
function codes(prefix: string, n: number) {
  return Array.from({ length: n }, (_, i) => ({ code: `${prefix}${i + 1}` }))
}

export const DOMAINS: Domain[] = [
  {
    key: 'knowledge',
    label: DIMS.knowledge.labelTh,
    labelEn: DIMS.knowledge.labelEn,
    color: DIMS.knowledge.color,
    groups: [
      { prefix: 'KE', label: 'Entrepreneurship', items: codes('KE', 4) },
      { prefix: 'KC', label: 'Communication', items: codes('KC', 3) },
      { prefix: 'KR', label: 'Research', items: codes('KR', 4) },
      { prefix: 'KT', label: 'Technology', items: codes('KT', 3) },
    ],
  },
  {
    key: 'skill',
    label: DIMS.skill.labelTh,
    labelEn: DIMS.skill.labelEn,
    color: DIMS.skill.color,
    groups: [
      { prefix: 'SA', label: 'Analysis', items: codes('SA', 3) },
      { prefix: 'SC', label: 'Communication', items: codes('SC', 3) },
      { prefix: 'SD', label: 'Digital', items: codes('SD', 3) },
      { prefix: 'SE', label: 'English', items: codes('SE', 3) },
      { prefix: 'SL', label: 'Leadership', items: codes('SL', 4) },
    ],
  },
  {
    key: 'attitude',
    label: DIMS.attitude.labelTh,
    labelEn: DIMS.attitude.labelEn,
    color: DIMS.attitude.color,
    groups: [
      { prefix: 'AD', label: 'Dare', items: codes('AD', 3) },
      { prefix: 'AC', label: 'Creativity', items: codes('AC', 3) },
      { prefix: 'AE', label: 'Entrepreneurship', items: codes('AE', 3) },
    ],
  },
  {
    key: 'character',
    label: DIMS.character.labelTh,
    labelEn: DIMS.character.labelEn,
    color: DIMS.character.color,
    groups: [
      { prefix: 'CT', label: 'Time Mgmt', items: codes('CT', 2) },
      { prefix: 'CP', label: 'Personality', items: codes('CP', 3) },
      { prefix: 'CR', label: 'Resilience', items: codes('CR', 3) },
      { prefix: 'CW', label: 'Will', items: codes('CW', 3) },
    ],
  },
  {
    key: 'aesthetics',
    label: DIMS.aesthetics.labelTh,
    labelEn: DIMS.aesthetics.labelEn,
    color: DIMS.aesthetics.color,
    groups: [
      { prefix: 'AEC', label: 'Creativity', items: codes('AEC', 2) },
      { prefix: 'AEL', label: 'Lifestyle', items: codes('AEL', 3) },
    ],
  },
  {
    key: 'ethics',
    label: DIMS.ethics.labelTh,
    labelEn: DIMS.ethics.labelEn,
    color: DIMS.ethics.color,
    groups: [{ prefix: 'E', label: 'Ethics', items: codes('E', 3) }],
  },
  {
    key: 'wellness',
    label: DIMS.wellness.labelTh,
    labelEn: DIMS.wellness.labelEn,
    color: DIMS.wellness.color,
    groups: [{ prefix: 'W', label: 'Wellness', items: codes('W', 5) }],
  },
]

// ─────────────────────────────────────────────────────────────
// Identity ladder LV1–6 (บันไดเอกลักษณ์ "ผู้ประกอบการ + นักสื่อสาร")
// LV1–3 = Intrapreneurship · LV4–6 = Entrepreneurship
// ─────────────────────────────────────────────────────────────
export const IDENTITY_LADDER: IdentityRung[] = [
  {
    level: 1,
    zone: 'intra',
    title: 'มี Mindset ผู้ประกอบการ + นักสื่อสาร',
    meaning: 'เริ่มมีกรอบคิดแบบผู้ประกอบการและนักสื่อสาร',
    activities: ['BCA Inspiration Talk'],
  },
  {
    level: 2,
    zone: 'intra',
    title: 'ใช้เครื่องมือธุรกิจ + สื่อสารได้',
    meaning: 'ลงมือใช้เครื่องมือธุรกิจและสื่อสารเบื้องต้น',
    activities: [
      'BCA Stock Trading',
      'โชว์ของหน้าตึก',
      'BCA Content Creator',
    ],
  },
  {
    level: 3,
    zone: 'intra',
    title: 'ออกแบบแผนธุรกิจ + แผนสื่อสารได้',
    meaning: 'วางแผนธุรกิจและแผนการสื่อสารเป็นระบบ',
    activities: ['BCA Young Entrepreneur Challenge'],
  },
  {
    level: 4,
    zone: 'entre',
    title: 'ทำได้ ขายได้',
    meaning: 'แสดงหลักฐานการทำธุรกิจจริง',
    activities: ['BCA Business Showcase'],
  },
  {
    level: 5,
    zone: 'entre',
    title: '+ ไปได้ (BMC ครบ / ที่ปรึกษา / แยกบัญชี)',
    meaning: 'ธุรกิจเดินหน้าอย่างมีระบบ',
    activities: ['BCA Startup Incubation'],
  },
  {
    level: 6,
    zone: 'entre',
    title: '+ โตได้ (ขยาย / จดทะเบียน)',
    meaning: 'ขยายกิจการและจดทะเบียนจริง',
    activities: ['BCA Business Expansion'],
  },
]

export function rungOf(level: number): IdentityRung | null {
  return IDENTITY_LADDER.find((r) => r.level === level) ?? null
}
