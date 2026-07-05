// ─────────────────────────────────────────────────────────────
// Types กลางของระบบ Skill Transcript (เดโม่ ม.พะเยา — คณะ BCA)
// ADDENDUM (Tier A): อัปเป็น 7 โดเมน + Identity ladder + taxonomy ย่อย
// ─────────────────────────────────────────────────────────────

/** คีย์ของ 7 โดเมน competency (ตาม BCA Identity framework §3) */
export type DimKey =
  | 'knowledge'
  | 'skill'
  | 'attitude'
  | 'character'
  | 'aesthetics'
  | 'ethics'
  | 'wellness'

/** คะแนน 7 โดเมน 0–10 ต่อด้าน */
export type Dims = Record<DimKey, number>

export const DIM_KEYS: DimKey[] = [
  'knowledge',
  'skill',
  'attitude',
  'character',
  'aesthetics',
  'ethics',
  'wellness',
]

export function emptyDims(): Dims {
  return {
    knowledge: 0,
    skill: 0,
    attitude: 0,
    character: 0,
    aesthetics: 0,
    ethics: 0,
    wellness: 0,
  }
}

// ── Taxonomy (โดเมน → กลุ่มย่อย → โค้ด) สำหรับ sunburst / portfolio ──
// ⚠️ โค้ดเหล่านี้ประมาณจาก PDF ลูกค้า — TODO: confirm with client (master list)
export interface SubCompetency {
  code: string // เช่น KE1
  label?: string
}
export interface SubGroup {
  prefix: string // เช่น KE
  label: string // เช่น Entrepreneurship
  items: SubCompetency[]
}
export interface Domain {
  key: DimKey
  label: string // ไทย
  labelEn: string
  color: string
  groups: SubGroup[]
}

// ── Identity ladder (LV1–6) ──
// null = กิจกรรม co-curricular ทั่วไป (ให้คะแนนโดเมน แต่ไม่ปลดระดับ Identity)
export type IdentityLevel = 1 | 2 | 3 | 4 | 5 | 6 | null

export interface IdentityRung {
  level: 1 | 2 | 3 | 4 | 5 | 6
  zone: 'intra' | 'entre'
  title: string // เช่น "Mindset ผู้ประกอบการ"
  meaning: string
  activities: string[] // ชื่อกิจกรรมที่ปลดล็อกระดับนี้
}

/** คณะ — เดโม่โฟกัส BCA แต่เก็บโครงไว้เผื่อขยาย */
export interface Faculty {
  id: string
  name: string
  nameEn: string
  abbr: string
}

/** โค้ดสาขา 8 สาขาของคณะ BCA (ตาม PDF ลูกค้า) */
export type MajorCode =
  | 'ComM'
  | 'ECON'
  | 'F&I'
  | 'ACC'
  | 'BMG'
  | 'DMKT'
  | 'NMC'
  | 'TR&H'

export interface Student {
  id: string
  studentCode: string
  title: string
  firstName: string
  lastName: string
  facultyId: string
  major: string
  majorCode: MajorCode
  year: number
  enrolledYear: number
  avatarHue: number // ใช้วาด avatar SVG แบบ deterministic (ไม่มีรูปจริง)
  rich?: boolean // นิสิต "ตัวอย่างเด่น" participation เต็ม (drill-down/portfolio)
}

export type ActivityStatus = 'draft' | 'open' | 'closed'

export interface Activity {
  id: string
  code: string
  name: string
  description: string
  facultyId: string
  category: string
  startAt: string // ISO
  endAt: string // ISO
  location: string
  capacity?: number
  dims: Dims // น้ำหนักคะแนน 7 โดเมนของกิจกรรมนี้ 0–10
  identityLevel: IdentityLevel // ระดับ Identity ที่กิจกรรมนี้ปลด (null = ไม่ปลด)
  subCodes?: string[] // Tier B เท่านั้น — โค้ด competency ย่อยที่กิจกรรมแตะ
  joinCode: string
  status: ActivityStatus
  createdAt: string
}

export type ParticipationStatus = 'checked_in' | 'completed'

export interface Participation {
  id: string
  studentId: string
  activityId: string
  checkinAt: string
  status: ParticipationStatus
  dimsSnapshot: Dims // ⚠️ สแนปช็อตตอนเข้าร่วม (กันแก้กิจกรรมย้อนหลัง)
  identityLevel: IdentityLevel // สแนปช็อตระดับที่กิจกรรมปลด
}

/** persona แบบ template (personality-test style) — optional เล็ก ๆ ตาม ADDENDUM */
export interface Persona {
  archetype: string // ฉายา เช่น "นักสื่อสารสายวิเคราะห์"
  tagline: string // คำโปรยสั้น
  description: string // 2–3 ประโยค
  emojiKey: DimKey // ด้านหลักไว้เลือกสี/ไอคอน (ไม่ใช้ emoji จริง)
}

export interface TranscriptActivityItem {
  participation: Participation
  activity: Activity
}

export interface Transcript {
  studentId: string
  student: Student
  totals: Dims // ผลรวม dimsSnapshot ของ participation ที่ completed
  axisMax: Dims // ค่าสูงสุดใน cohort ต่อด้าน (ให้รูปทรงเรดาร์เทียบกันได้)
  top2: DimKey[]
  bottom2: DimKey[]
  balanceScore: number // 0–100
  completedCount: number
  totalScore: number // ผลรวมทุกด้าน
  identityLevel: number // 0–6 (0 = ยังไม่เข้าเส้น)
  identityScore: number // Identity% 0–100
  activities: TranscriptActivityItem[]
  persona: Persona
}

// ── DTO สำหรับสร้าง/แก้กิจกรรม ──
export interface ActivityInput {
  name: string
  description: string
  facultyId: string
  category: string
  startAt: string
  endAt: string
  location: string
  capacity?: number
  dims: Dims
  identityLevel?: IdentityLevel
  status?: ActivityStatus
}

// ── Dashboard ──
export interface DimDistributionItem {
  key: DimKey
  total: number // แต้มด้านนี้ที่ทั้ง cohort ได้รับรวม
  offered: number // จำนวน "แต้มที่เปิดให้" จากกิจกรรม (ดูว่าเปิดสอนด้านนี้แค่ไหน)
  activityCount: number // กิจกรรมที่แตะด้านนี้ (dims >= 5)
}

export interface PopularActivityItem {
  activity: Activity
  count: number
}

export interface TimePoint {
  label: string
  count: number
}

export interface MajorBreakdownItem {
  major: string
  students: number
  checkins: number
}

export interface YearBreakdownItem {
  year: number
  students: number
  checkins: number
}

/** อันดับ Identity% ราย­สาขา (reproduce ตารางลูกค้า) */
export interface MajorIdentityRow {
  majorCode: MajorCode
  name: string
  n: number
  identityPct: number
  levelCounts: number[] // การกระจายระดับ index 0..6 (0 = ยังไม่เข้าเส้น)
}

export interface DashboardStats {
  activeStudents: number
  totalStudents: number
  totalActivities: number
  openActivities: number
  totalCheckins: number
  avgActivitiesPerStudent: number
  dimDistribution: DimDistributionItem[]
  underServed: DimKey[] // ด้านที่มหาลัย "จัดน้อย" — ขายจุดวางแผนพัฒนานิสิต
  overServed: DimKey[]
  popularActivities: PopularActivityItem[]
  timeline: TimePoint[]
  byMajor: MajorBreakdownItem[]
  byYear: YearBreakdownItem[]
}
