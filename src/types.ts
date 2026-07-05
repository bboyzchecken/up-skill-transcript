// ─────────────────────────────────────────────────────────────
// Types กลางของระบบ Skill Transcript (เดโม่ ม.พะเยา — คณะ BCA)
// ─────────────────────────────────────────────────────────────

/** คีย์ของ 6 ด้าน (ล็อกแล้ว ตาม §4) */
export type DimKey =
  | 'knowledge'
  | 'skills'
  | 'attitude'
  | 'ethics'
  | 'aesthetics'
  | 'wellness'

/** คะแนน 6 ด้าน 0–10 ต่อด้าน */
export type Dims = Record<DimKey, number>

export const DIM_KEYS: DimKey[] = [
  'knowledge',
  'skills',
  'attitude',
  'ethics',
  'aesthetics',
  'wellness',
]

export function emptyDims(): Dims {
  return {
    knowledge: 0,
    skills: 0,
    attitude: 0,
    ethics: 0,
    aesthetics: 0,
    wellness: 0,
  }
}

/** คณะ — เดโม่โฟกัส BCA แต่เก็บโครงไว้เผื่อขยาย */
export interface Faculty {
  id: string
  name: string
  nameEn: string
  abbr: string
}

export interface Student {
  id: string
  studentCode: string
  title: string
  firstName: string
  lastName: string
  facultyId: string
  major: string
  year: number
  enrolledYear: number
  avatarHue: number // ใช้วาด avatar SVG แบบ deterministic (ไม่มีรูปจริง)
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
  dims: Dims // น้ำหนักคะแนน 6 ด้านของกิจกรรมนี้ 0–10
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
}

/** persona แบบ template (personality-test style) */
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
