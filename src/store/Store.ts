import type {
  Activity,
  ActivityInput,
  DashboardStats,
  Faculty,
  Participation,
  Student,
  Transcript,
} from '../types'

// ─────────────────────────────────────────────────────────────
// Store interface — UI เรียกผ่านตัวนี้เท่านั้น (ห้ามแตะ localStorage/fetch ตรง ๆ)
// สลับ impl ได้: LocalStore (ตอนนี้) ↔ ApiStore (เฟสจริง) โดยไม่แก้หน้าจอ
// ─────────────────────────────────────────────────────────────
export interface Store {
  // faculties
  listFaculties(): Promise<Faculty[]>

  // activities
  listActivities(): Promise<Activity[]>
  getActivity(id: string): Promise<Activity | null>
  getActivityByJoinCode(code: string): Promise<Activity | null>
  createActivity(input: ActivityInput): Promise<Activity>
  updateActivity(id: string, input: Partial<ActivityInput>): Promise<Activity>

  // participation
  join(activityId: string, studentId: string): Promise<Participation>
  listParticipants(activityId: string): Promise<Participation[]>

  // students / transcript
  listStudents(query?: string): Promise<Student[]>
  getStudent(id: string): Promise<Student | null>
  getTranscript(studentId: string): Promise<Transcript>

  // dashboard
  dashboardStats(): Promise<DashboardStats>

  // admin
  seed(): Promise<void>
  reset(): Promise<void>

  // ── reactive layer (นอกสัญญา async หลัก แต่จำเป็นสำหรับ live UI) ──
  /** subscribe การเปลี่ยนแปลง (รวมข้ามแท็บผ่าน storage event) */
  subscribe(cb: () => void): () => void
  /** version ปัจจุบัน — ใช้กับ useSyncExternalStore */
  getVersion(): number
}
