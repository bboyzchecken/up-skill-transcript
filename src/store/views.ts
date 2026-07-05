// ─────────────────────────────────────────────────────────────
// Pure view/derivation functions — ใช้ร่วมกันระหว่าง LocalStore (async)
// และ reactive hooks (sync) เพื่อไม่ให้ logic ซ้ำซ้อน
// ─────────────────────────────────────────────────────────────
import type {
  DashboardStats,
  DimDistributionItem,
  Dims,
  MajorCode,
  MajorIdentityRow,
  Participation,
  Student,
  Transcript,
} from '../types'
import { DIM_KEYS, emptyDims } from '../types'
import type { PersistedState } from '../seed/seed'
import {
  balanceScore,
  bottom2,
  cohortAxisMax,
  rankDims,
  sumDims,
  top2,
  totalOf,
} from '../lib/compute'
import { identityLevelOf, studentIdentityPct } from '../lib/identity'
import { buildPersona } from '../lib/persona'

const TH_M = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']

// เดโม่: นับทุก participation (checked_in + completed) → เช็กอินแล้วมีผลกับเรดาร์ทันที
function participationsOf(state: PersistedState, studentId: string): Participation[] {
  return state.participations.filter((p) => p.studentId === studentId)
}

function totalsOf(state: PersistedState, studentId: string) {
  return sumDims(participationsOf(state, studentId).map((p) => p.dimsSnapshot))
}

export function buildTranscript(
  state: PersistedState,
  studentId: string,
): Transcript {
  const student = state.students.find((s) => s.id === studentId)
  if (!student) throw new Error('ไม่พบนิสิต')

  const parts = participationsOf(state, studentId)
  const totals = sumDims(parts.map((p) => p.dimsSnapshot))
  const hasData = parts.length > 0

  const allTotals = state.students.map((s) => totalsOf(state, s.id))
  const axisMax = cohortAxisMax(allTotals)

  const activities = parts
    .map((p) => ({
      participation: p,
      activity: state.activities.find((a) => a.id === p.activityId)!,
    }))
    .filter((x) => x.activity)
    .sort((a, b) =>
      b.participation.checkinAt.localeCompare(a.participation.checkinAt),
    )

  const identityLevel = identityLevelOf(parts.map((p) => p.identityLevel))
  const identityScore = studentIdentityPct(identityLevel, totals)

  return {
    studentId,
    student,
    totals,
    axisMax,
    top2: top2(totals),
    bottom2: bottom2(totals),
    balanceScore: balanceScore(totals),
    completedCount: parts.length,
    totalScore: totalOf(totals),
    identityLevel,
    identityScore,
    activities,
    persona: buildPersona(totals, hasData),
  }
}

// ── ราย­สาขา: เรดาร์เฉลี่ย 7 แกน + อันดับ Identity% ──
function studentIdentity(state: PersistedState, studentId: string) {
  const parts = participationsOf(state, studentId)
  const totals = sumDims(parts.map((p) => p.dimsSnapshot))
  const level = identityLevelOf(parts.map((p) => p.identityLevel))
  return { totals, level, pct: studentIdentityPct(level, totals) }
}

/** เรดาร์เฉลี่ย 7 แกนของสาขา (เฉลี่ย totals ต่อนิสิต) */
export function buildMajorRadar(
  state: PersistedState,
  majorCode: MajorCode,
): Dims {
  const list = state.students.filter((s) => s.majorCode === majorCode)
  const out = emptyDims()
  if (list.length === 0) return out
  for (const s of list) {
    const { totals } = studentIdentity(state, s.id)
    for (const k of DIM_KEYS) out[k] += totals[k]
  }
  for (const k of DIM_KEYS) out[k] = Math.round((out[k] / list.length) * 10) / 10
  return out
}

/** อันดับ Identity% ราย­สาขา (reproduce ตารางลูกค้า) */
export function buildIdentityRanking(state: PersistedState): MajorIdentityRow[] {
  const groups = new Map<MajorCode, { name: string; ids: string[] }>()
  for (const s of state.students) {
    if (!groups.has(s.majorCode))
      groups.set(s.majorCode, { name: s.major, ids: [] })
    groups.get(s.majorCode)!.ids.push(s.id)
  }
  const rows: MajorIdentityRow[] = []
  for (const [majorCode, g] of groups) {
    const levelCounts = new Array(7).fill(0)
    let sum = 0
    for (const id of g.ids) {
      const { level, pct } = studentIdentity(state, id)
      sum += pct
      levelCounts[level]++
    }
    rows.push({
      majorCode,
      name: g.name,
      n: g.ids.length,
      identityPct: g.ids.length ? Math.round(sum / g.ids.length) : 0,
      levelCounts,
    })
  }
  return rows.sort((a, b) => b.identityPct - a.identityPct)
}

export interface ParticipantRow {
  participation: Participation
  student: Student
}

export function listParticipantsWithStudents(
  state: PersistedState,
  activityId: string,
): ParticipantRow[] {
  return state.participations
    .filter((p) => p.activityId === activityId)
    .map((p) => ({
      participation: p,
      student: state.students.find((s) => s.id === p.studentId)!,
    }))
    .filter((r) => r.student)
    .sort((a, b) =>
      b.participation.checkinAt.localeCompare(a.participation.checkinAt),
    )
}

export function buildDashboard(state: PersistedState): DashboardStats {
  const { students, activities, participations } = state
  const activeIds = new Set(participations.map((p) => p.studentId))
  const totalCheckins = participations.length

  const received = emptyDims()
  for (const p of participations)
    for (const k of DIM_KEYS) received[k] += p.dimsSnapshot[k]
  const offered = emptyDims()
  for (const a of activities)
    for (const k of DIM_KEYS) offered[k] += a.dims[k]

  const dimDistribution: DimDistributionItem[] = DIM_KEYS.map((k) => ({
    key: k,
    total: received[k],
    offered: offered[k],
    activityCount: activities.filter((a) => a.dims[k] >= 5).length,
  }))
  const rankedByOffered = rankDims(offered)
  const overServed = rankedByOffered.slice(0, 2)
  const underServed = rankedByOffered.slice(-2).reverse()

  const countByAct = new Map<string, number>()
  for (const p of participations)
    countByAct.set(p.activityId, (countByAct.get(p.activityId) ?? 0) + 1)
  const popularActivities = activities
    .map((a) => ({ activity: a, count: countByAct.get(a.id) ?? 0 }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6)

  const monthMap = new Map<string, number>()
  for (const p of participations) {
    const dt = new Date(p.checkinAt)
    const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`
    monthMap.set(key, (monthMap.get(key) ?? 0) + 1)
  }
  const timeline = [...monthMap.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([key, count]) => {
      const [, m] = key.split('-')
      return { label: TH_M[Number(m) - 1], count }
    })

  const majorMap = new Map<string, { students: Set<string>; checkins: number }>()
  for (const s of students) {
    if (!majorMap.has(s.major))
      majorMap.set(s.major, { students: new Set(), checkins: 0 })
    majorMap.get(s.major)!.students.add(s.id)
  }
  for (const p of participations) {
    const s = students.find((x) => x.id === p.studentId)
    if (s) majorMap.get(s.major)!.checkins++
  }
  const byMajor = [...majorMap.entries()]
    .map(([major, v]) => ({
      major,
      students: v.students.size,
      checkins: v.checkins,
    }))
    .sort((a, b) => b.checkins - a.checkins)

  const yearMap = new Map<number, { students: Set<string>; checkins: number }>()
  for (let y = 1; y <= 4; y++) yearMap.set(y, { students: new Set(), checkins: 0 })
  for (const s of students) yearMap.get(s.year)?.students.add(s.id)
  for (const p of participations) {
    const s = students.find((x) => x.id === p.studentId)
    if (s) yearMap.get(s.year)!.checkins++
  }
  const byYear = [...yearMap.entries()].map(([year, v]) => ({
    year,
    students: v.students.size,
    checkins: v.checkins,
  }))

  return {
    activeStudents: activeIds.size,
    totalStudents: students.length,
    totalActivities: activities.length,
    openActivities: activities.filter((a) => a.status === 'open').length,
    totalCheckins,
    avgActivitiesPerStudent:
      students.length > 0
        ? Math.round((totalCheckins / students.length) * 10) / 10
        : 0,
    dimDistribution,
    underServed,
    overServed,
    popularActivities,
    timeline,
    byMajor,
    byYear,
  }
}
