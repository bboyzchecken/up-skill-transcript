// Calibrate per-major `strength` so identityRanking() lands near the client table.
// Run: npx tsx scripts/tune-seed.ts   (prints tuned strengths + final table)
import { buildSeed } from '../src/seed/seed'
import { buildIdentityRanking } from '../src/store/views'
import type { MajorCode } from '../src/types'

const TARGETS: { code: MajorCode; target: number }[] = [
  { code: 'ComM', target: 94 },
  { code: 'ECON', target: 93 },
  { code: 'F&I', target: 83 },
  { code: 'ACC', target: 82 },
  { code: 'BMG', target: 81 },
  { code: 'DMKT', target: 80 },
  { code: 'NMC', target: 63 },
  { code: 'TR&H', target: 59 },
]

function pctFor(code: MajorCode, strengths: Record<MajorCode, number>): number {
  const state = buildSeed(strengths)
  const rows = buildIdentityRanking(state)
  return rows.find((r) => r.majorCode === code)!.identityPct
}

// binary-search strength per major independently (fixed rng consumption → no cross-talk)
const strengths: Record<MajorCode, number> = {
  ComM: 0.9,
  ECON: 0.9,
  'F&I': 0.7,
  ACC: 0.7,
  BMG: 0.65,
  DMKT: 0.65,
  NMC: 0.35,
  'TR&H': 0.25,
}

for (const { code, target } of TARGETS) {
  let lo = 0
  let hi = 1
  for (let i = 0; i < 26; i++) {
    const mid = (lo + hi) / 2
    strengths[code] = mid
    const pct = pctFor(code, strengths)
    if (pct < target) lo = mid
    else hi = mid
  }
  strengths[code] = (lo + hi) / 2
}

const state = buildSeed(strengths)
const rows = buildIdentityRanking(state)
console.log('\nTuned strengths:')
for (const { code } of TARGETS)
  console.log(`  ${code.padEnd(6)} ${strengths[code].toFixed(3)}`)

console.log('\nRanking vs target:')
console.log('major   n    pct  target  Δ   levelCounts(0..6)')
for (const { code, target } of TARGETS) {
  const r = rows.find((x) => x.majorCode === code)!
  console.log(
    `${code.padEnd(6)} ${String(r.n).padStart(3)}  ${String(r.identityPct).padStart(3)}` +
      `   ${String(target).padStart(4)}  ${String(r.identityPct - target).padStart(3)}   [${r.levelCounts.join(',')}]`,
  )
}
console.log(`\ntotal students: ${state.students.length}`)
console.log(`total participations: ${state.participations.length}`)
console.log(`rich students: ${state.students.filter((s) => s.rich).length}`)
