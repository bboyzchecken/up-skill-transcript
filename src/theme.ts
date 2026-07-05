import type { DimKey } from './types'

// ─────────────────────────────────────────────────────────────
// สีทางการ มหาวิทยาลัยพะเยา = ม่วง–ทอง (ใช้เป็น brand chrome หลัก)
// ─────────────────────────────────────────────────────────────
export const UP = {
  purple: '#4A1E6E', // ม่วงพะเยาหลัก
  purpleDeep: '#2E1147', // ม่วงเข้ม (พื้นหลัง hero)
  purpleSoft: '#7A4BA8', // ม่วงอ่อน (accent/hover)
  gold: '#C9A227', // ทอง
  goldSoft: '#E4C766', // ทองอ่อน (ไฮไลต์)
} as const

export interface DimMeta {
  key: DimKey
  labelTh: string
  labelEn: string
  short: string // ป้ายสั้นบนแกนเรดาร์
  color: string
}

// 7 สีประจำโดเมน = category color ของ data-viz (คงเส้นคงวาทั้งระบบ)
// 5 สีแรกตรง sunburst ใน PDF ลูกค้า · ethics/wellness เพิ่มเข้ามา (ADDENDUM §5)
export const DIMS: Record<DimKey, DimMeta> = {
  knowledge: {
    key: 'knowledge',
    labelTh: 'ความรู้',
    labelEn: 'Knowledge',
    short: 'ความรู้',
    color: '#1F5C8B',
  },
  skill: {
    key: 'skill',
    labelTh: 'ทักษะ',
    labelEn: 'Skill',
    short: 'ทักษะ',
    color: '#E67E22',
  },
  attitude: {
    key: 'attitude',
    labelTh: 'ทัศนคติ',
    labelEn: 'Attitude',
    short: 'ทัศนคติ',
    color: '#27AE60',
  },
  character: {
    key: 'character',
    labelTh: 'อุปนิสัย',
    labelEn: 'Character',
    short: 'อุปนิสัย',
    color: '#29ABE2',
  },
  aesthetics: {
    key: 'aesthetics',
    labelTh: 'สุนทรียภาพ',
    labelEn: 'Aesthetics',
    short: 'สุนทรีย์',
    color: '#C0399B',
  },
  ethics: {
    key: 'ethics',
    labelTh: 'จริยธรรม',
    labelEn: 'Ethics',
    short: 'จริยธรรม',
    color: '#6C5CE7',
  },
  wellness: {
    key: 'wellness',
    labelTh: 'สุขภาวะ',
    labelEn: 'Wellness',
    short: 'สุขภาวะ',
    color: '#16A085',
  },
}

export const DIM_LIST: DimMeta[] = [
  DIMS.knowledge,
  DIMS.skill,
  DIMS.attitude,
  DIMS.character,
  DIMS.aesthetics,
  DIMS.ethics,
  DIMS.wellness,
]

export function dimColor(key: DimKey): string {
  return DIMS[key].color
}

export function dimLabel(key: DimKey): string {
  return DIMS[key].labelTh
}
