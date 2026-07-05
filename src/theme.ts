import type { DimKey } from './types'

// ─────────────────────────────────────────────────────────────
// สีทางการ มหาวิทยาลัยพะเยา = ม่วง–ทอง (ใช้เป็น brand chrome หลัก)
// * ค่าเฉดปรับได้ตามคู่มืออัตลักษณ์ มพ. ฉบับล่าสุด — ยืนยันก่อนล็อกจริง
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

// 6 สีประจำด้าน = category color ของ data-viz (คงเส้นคงวาทั้งระบบ ตาม §7)
export const DIMS: Record<DimKey, DimMeta> = {
  knowledge: {
    key: 'knowledge',
    labelTh: 'ความรู้',
    labelEn: 'Knowledge',
    short: 'ความรู้',
    color: '#3B82F6',
  },
  skills: {
    key: 'skills',
    labelTh: 'ทักษะ',
    labelEn: 'Skills',
    short: 'ทักษะ',
    color: '#14B8A6',
  },
  attitude: {
    key: 'attitude',
    labelTh: 'ทัศนคติ',
    labelEn: 'Attitude',
    short: 'ทัศนคติ',
    color: '#F59E0B',
  },
  ethics: {
    key: 'ethics',
    labelTh: 'คุณธรรม',
    labelEn: 'Ethics',
    short: 'คุณธรรม',
    color: '#8B5CF6',
  },
  aesthetics: {
    key: 'aesthetics',
    labelTh: 'สุนทรียภาพ',
    labelEn: 'Aesthetics',
    short: 'สุนทรีย์',
    color: '#EC4899',
  },
  wellness: {
    key: 'wellness',
    labelTh: 'สุขภาวะ',
    labelEn: 'Wellness',
    short: 'สุขภาวะ',
    color: '#10B981',
  },
}

export const DIM_LIST: DimMeta[] = [
  DIMS.knowledge,
  DIMS.skills,
  DIMS.attitude,
  DIMS.ethics,
  DIMS.aesthetics,
  DIMS.wellness,
]

export function dimColor(key: DimKey): string {
  return DIMS[key].color
}

export function dimLabel(key: DimKey): string {
  return DIMS[key].labelTh
}
