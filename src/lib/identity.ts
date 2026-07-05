import { DIM_KEYS } from '../types'
import type { Dims, IdentityLevel } from '../types'

// ─────────────────────────────────────────────────────────────
// Identity compute layer (Tier A) — สูตร placeholder แยกไฟล์เดียว
// ⚠️ TODO: confirm with client — ลูกค้าจะให้สูตร Identity% จริงทีหลัง
// ─────────────────────────────────────────────────────────────

/** auto-leveling: ระดับ = สูงสุดของกิจกรรมที่ทำ (บันไดสะสม) · 0 = ยังไม่เข้าเส้น */
export function identityLevelOf(levels: IdentityLevel[]): number {
  let max = 0
  for (const l of levels) if (l && l > max) max = l
  return max
}

/** จำนวนโดเมนที่มีคะแนน > 0 (0..7) */
export function domainsCovered(totals: Dims): number {
  return DIM_KEYS.reduce((n, k) => n + (totals[k] > 0 ? 1 : 0), 0)
}

/**
 * Identity% ของนิสิต (0–100) = ผสมระดับบันได + ความครบของ competency
 * studentIdentity% = 100 × ( 0.5×(level/6) + 0.5×(โดเมนที่มีคะแนน/7) )
 */
export function studentIdentityPct(
  identityLevel: number,
  totals: Dims,
): number {
  const levelPart = 0.5 * (identityLevel / 6)
  const coverPart = 0.5 * (domainsCovered(totals) / 7)
  return Math.round(100 * (levelPart + coverPart))
}
