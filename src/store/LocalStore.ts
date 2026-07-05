import type { Store } from './Store'
import type {
  Activity,
  ActivityInput,
  DashboardStats,
  Faculty,
  Participation,
  Student,
  Transcript,
} from '../types'
import { buildSeed, type PersistedState } from '../seed/seed'
import { buildDashboard, buildTranscript } from './views'

const STORAGE_KEY = 'skill-transcript:v1'

function loadState(): PersistedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as PersistedState
  } catch {
    return null
  }
}

function saveState(state: PersistedState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* โหมด private / เต็ม — เดโม่ยังทำงานในหน่วยความจำได้ */
  }
}

function genId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}${Math.random()
    .toString(36)
    .slice(2, 6)}`
}

function genJoinCode(): string {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  const nums = '23456789'
  let out = ''
  for (let i = 0; i < 3; i++)
    out += letters[Math.floor(Math.random() * letters.length)]
  for (let i = 0; i < 3; i++)
    out += nums[Math.floor(Math.random() * nums.length)]
  return out
}

export class LocalStore implements Store {
  private state: PersistedState
  private version = 0
  private listeners = new Set<() => void>()

  constructor() {
    const loaded = loadState()
    if (loaded) {
      this.state = loaded
    } else {
      this.state = buildSeed()
      saveState(this.state)
    }
    // sync ข้ามแท็บ — หัวใจของ "สแกน (อีกแท็บ) → เด้งขึ้นจอ"
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY) {
          const next = loadState()
          if (next) {
            this.state = next
            this.bump()
          }
        }
      })
    }
  }

  // ── reactive layer ──
  subscribe(cb: () => void): () => void {
    this.listeners.add(cb)
    return () => this.listeners.delete(cb)
  }
  getVersion(): number {
    return this.version
  }
  private bump() {
    this.version++
    this.listeners.forEach((l) => l())
  }
  private commit() {
    saveState(this.state)
    this.bump()
  }

  /** snapshot ปัจจุบัน (สำหรับ hook อ่านแบบ sync) */
  snapshot(): PersistedState {
    return this.state
  }

  // ── faculties ──
  async listFaculties(): Promise<Faculty[]> {
    return this.state.faculties
  }

  // ── activities ──
  async listActivities(): Promise<Activity[]> {
    return [...this.state.activities].sort((a, b) =>
      b.startAt.localeCompare(a.startAt),
    )
  }
  async getActivity(id: string): Promise<Activity | null> {
    return this.state.activities.find((a) => a.id === id) ?? null
  }
  async getActivityByJoinCode(code: string): Promise<Activity | null> {
    const c = code.trim().toUpperCase()
    return (
      this.state.activities.find((a) => a.joinCode.toUpperCase() === c) ?? null
    )
  }
  async createActivity(input: ActivityInput): Promise<Activity> {
    const activity: Activity = {
      id: genId('ac'),
      code: `ACT-${genJoinCode().slice(0, 4)}`,
      name: input.name,
      description: input.description,
      facultyId: input.facultyId,
      category: input.category,
      startAt: input.startAt,
      endAt: input.endAt,
      location: input.location,
      capacity: input.capacity,
      dims: { ...input.dims },
      joinCode: genJoinCode(),
      status: input.status ?? 'open',
      createdAt: new Date().toISOString(),
    }
    this.state.activities = [activity, ...this.state.activities]
    this.commit()
    return activity
  }
  async updateActivity(
    id: string,
    input: Partial<ActivityInput>,
  ): Promise<Activity> {
    const idx = this.state.activities.findIndex((a) => a.id === id)
    if (idx < 0) throw new Error('ไม่พบกิจกรรม')
    const cur = this.state.activities[idx]
    const next: Activity = {
      ...cur,
      ...input,
      dims: input.dims ? { ...input.dims } : cur.dims,
    }
    this.state.activities = [
      ...this.state.activities.slice(0, idx),
      next,
      ...this.state.activities.slice(idx + 1),
    ]
    this.commit()
    return next
  }

  // ── participation ──
  async join(activityId: string, studentId: string): Promise<Participation> {
    const activity = await this.getActivity(activityId)
    if (!activity) throw new Error('ไม่พบกิจกรรม')
    const existing = this.state.participations.find(
      (p) => p.activityId === activityId && p.studentId === studentId,
    )
    if (existing) return existing // กันเข้าร่วมซ้ำ
    const p: Participation = {
      id: genId('pa'),
      studentId,
      activityId,
      checkinAt: new Date().toISOString(),
      status: 'checked_in',
      dimsSnapshot: { ...activity.dims },
    }
    this.state.participations = [...this.state.participations, p]
    this.commit()
    return p
  }
  async listParticipants(activityId: string): Promise<Participation[]> {
    return this.state.participations
      .filter((p) => p.activityId === activityId)
      .sort((a, b) => b.checkinAt.localeCompare(a.checkinAt))
  }

  // ── students ──
  async listStudents(query?: string): Promise<Student[]> {
    let list = [...this.state.students]
    if (query && query.trim()) {
      const q = query.trim().toLowerCase()
      list = list.filter(
        (s) =>
          `${s.firstName} ${s.lastName}`.toLowerCase().includes(q) ||
          s.studentCode.includes(q) ||
          s.major.toLowerCase().includes(q),
      )
    }
    return list.sort((a, b) => a.studentCode.localeCompare(b.studentCode))
  }
  async getStudent(id: string): Promise<Student | null> {
    return this.state.students.find((s) => s.id === id) ?? null
  }

  // ── transcript ──
  async getTranscript(studentId: string): Promise<Transcript> {
    return buildTranscript(this.state, studentId)
  }

  // ── dashboard ──
  async dashboardStats(): Promise<DashboardStats> {
    return buildDashboard(this.state)
  }

  // ── admin ──
  async seed(): Promise<void> {
    if (this.state.students.length === 0) {
      this.state = buildSeed()
      this.commit()
    }
  }
  async reset(): Promise<void> {
    this.state = buildSeed()
    this.commit()
  }
}
