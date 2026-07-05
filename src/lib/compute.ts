import { DIM_KEYS, emptyDims } from '../types'
import type { Dims, DimKey } from '../types'

/** ค่าเต็ม 10 ทุกด้าน — ใช้ตั้ง max ของเรดาร์กิจกรรม (สเกลคงที่ 0–10) */
export const MAX10: Dims = {
  knowledge: 10,
  skill: 10,
  attitude: 10,
  character: 10,
  aesthetics: 10,
  ethics: 10,
  wellness: 10,
}

/** รวมคะแนนหลายชุดเข้าด้วยกัน */
export function sumDims(list: Dims[]): Dims {
  const out = emptyDims()
  for (const d of list) {
    for (const k of DIM_KEYS) out[k] += d[k]
  }
  return out
}

/** เรียงด้านจากมากไปน้อย (คืน key) — ตัดเสมอด้วยลำดับ DIM_KEYS ให้ผลนิ่ง */
export function rankDims(dims: Dims): DimKey[] {
  return [...DIM_KEYS].sort((a, b) => {
    if (dims[b] !== dims[a]) return dims[b] - dims[a]
    return DIM_KEYS.indexOf(a) - DIM_KEYS.indexOf(b)
  })
}

export function top2(dims: Dims): DimKey[] {
  return rankDims(dims).slice(0, 2)
}

export function bottom2(dims: Dims): DimKey[] {
  return rankDims(dims).slice(-2).reverse() // ต่ำสุดก่อน
}

export function totalOf(dims: Dims): number {
  return DIM_KEYS.reduce((s, k) => s + dims[k], 0)
}

/**
 * Balance score 0–100 = ความสม่ำเสมอของ 6 ด้าน
 * 100 = ทุกด้านเท่ากันเป๊ะ (รอบด้าน) · ต่ำ = เรดาร์แหลม (เชี่ยวเฉพาะทาง)
 * วิธี: 100 − (ค่าเบี่ยงเบนมาตรฐาน / ค่าเฉลี่ย) ที่ normalize แล้ว
 */
export function balanceScore(dims: Dims): number {
  const vals = DIM_KEYS.map((k) => dims[k])
  const sum = vals.reduce((s, v) => s + v, 0)
  if (sum <= 0) return 0
  const mean = sum / vals.length
  const variance =
    vals.reduce((s, v) => s + (v - mean) * (v - mean), 0) / vals.length
  const std = Math.sqrt(variance)
  const cv = std / mean // coefficient of variation (0 = สม่ำเสมอ)
  const score = 100 * (1 - Math.min(cv, 1))
  return Math.round(score)
}

/** ค่าสูงสุดต่อด้านใน cohort — ใช้ตั้ง max ของแต่ละแกนเรดาร์ */
export function cohortAxisMax(allTotals: Dims[]): Dims {
  const out = emptyDims()
  for (const t of allTotals) {
    for (const k of DIM_KEYS) out[k] = Math.max(out[k], t[k])
  }
  // กันหารศูนย์ — อย่างน้อยแกนละ 1
  for (const k of DIM_KEYS) out[k] = Math.max(out[k], 1)
  return out
}
