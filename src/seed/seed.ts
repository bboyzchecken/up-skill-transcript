import type {
  Activity,
  Dims,
  Faculty,
  IdentityLevel,
  MajorCode,
  Participation,
  Student,
} from '../types'
import { FEMALE_FIRST, LAST, MALE_FIRST } from './names'

export interface PersistedState {
  faculties: Faculty[]
  students: Student[]
  activities: Activity[]
  participations: Participation[]
}

// ── seeded PRNG (mulberry32) — เดโม่ต้อง reproducible ──
function mulberry32(seed: number) {
  let a = seed >>> 0
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function pick<T>(rng: () => number, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)]
}
function randInt(rng: () => number, min: number, max: number): number {
  return min + Math.floor(rng() * (max - min + 1))
}
function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v))
}

// dims: d(knowledge, skill, attitude, character, aesthetics, ethics, wellness)
const d = (
  knowledge: number,
  skill: number,
  attitude: number,
  character: number,
  aesthetics: number,
  ethics: number,
  wellness: number,
): Dims => ({ knowledge, skill, attitude, character, aesthetics, ethics, wellness })

// ── คณะ BCA (โฟกัสคณะเดียว) ──
const BCA: Faculty = {
  id: 'fac-bca',
  name: 'คณะบริหารธุรกิจและนิเทศศาสตร์',
  nameEn: 'School of Business and Communication Arts',
  abbr: 'BCA',
}

// ── 8 สาขา + เลขลูกค้า (ADDENDUM §4) ──
interface MajorDef {
  code: MajorCode
  name: string
  codeNum: string // 2 หลักในรหัสนิสิต
  n: number // จำนวนนิสิต (จาก PDF)
  target: number // Identity% เป้า (จาก PDF)
  strength: number // ตัวจูน engagement ให้ค่าเฉลี่ยเข้าเป้า (คาลิเบรตจาก harness)
}

// strength จูนด้วย scripts/tune-seed.ts ให้ identityRanking() ออกใกล้ target (±2)
const MAJORS: MajorDef[] = [
  { code: 'ComM', name: 'การจัดการการสื่อสาร', codeNum: '21', n: 46, target: 94, strength: 0.965 },
  { code: 'ECON', name: 'เศรษฐศาสตร์', codeNum: '22', n: 21, target: 93, strength: 0.955 },
  { code: 'F&I', name: 'การเงินและการลงทุน', codeNum: '23', n: 94, target: 83, strength: 0.71 },
  { code: 'ACC', name: 'การบัญชี', codeNum: '24', n: 29, target: 82, strength: 0.67 },
  { code: 'BMG', name: 'การจัดการธุรกิจ', codeNum: '25', n: 61, target: 81, strength: 0.668 },
  { code: 'DMKT', name: 'การตลาดดิจิทัล', codeNum: '26', n: 48, target: 80, strength: 0.63 },
  { code: 'NMC', name: 'การสื่อสารสื่อใหม่', codeNum: '27', n: 92, target: 63, strength: 0.425 },
  { code: 'TR&H', name: 'การท่องเที่ยวและการโรงแรม', codeNum: '28', n: 43, target: 59, strength: 0.372 },
]

// ── กิจกรรม BCA จริง + identityLevel (ADDENDUM §4) ──
interface ActivityDef {
  code: string
  name: string
  description: string
  category: string
  location: string
  monthOffset: number
  dims: Dims
  identityLevel: IdentityLevel
  status: Activity['status']
  joinCode: string
  capacity?: number
  ladderPrimary?: number // ระดับที่ใช้เป็น "ตัวแทน" ของบันได (leveling)
}

const ACTIVITY_DEFS: ActivityDef[] = [
  // ── บันได Identity LV1–6 ──
  {
    code: 'INSP',
    name: 'BCA Inspiration Talk',
    description:
      'เปิดโลกกรอบคิดผู้ประกอบการและนักสื่อสาร ฟังประสบการณ์จริงจากผู้ก่อตั้งธุรกิจและครีเอเตอร์รุ่นพี่ จุดประกาย Identity ของคณะ BCA',
    category: 'Identity · แรงบันดาลใจ',
    location: 'หอประชุมพญางำเมือง',
    monthOffset: 0,
    dims: d(5, 0, 6, 0, 0, 0, 0),
    identityLevel: 1,
    status: 'closed',
    joinCode: 'INSP01',
    capacity: 400,
    ladderPrimary: 1,
  },
  {
    code: 'STCK',
    name: 'BCA Stock Trading Challenge',
    description:
      'จำลองการลงทุนในตลาดหุ้นด้วยพอร์ตเสมือน ฝึกอ่านข้อมูล วิเคราะห์ความเสี่ยง และใช้เครื่องมือทางการเงินจริง',
    category: 'Identity · เครื่องมือธุรกิจ',
    location: 'อาคาร ICT ห้องปฏิบัติการ',
    monthOffset: 2,
    dims: d(7, 6, 0, 0, 0, 0, 0),
    identityLevel: 2,
    status: 'closed',
    joinCode: 'STCK02',
    capacity: 120,
    ladderPrimary: 2,
  },
  {
    code: 'BOOTH',
    name: 'โชว์ของหน้าตึก (Pop-up Booth)',
    description:
      'เปิดบูธขายสินค้า/บริการจริงหน้าอาคารคณะ ฝึกตั้งราคา ดูแลลูกค้า และเล่าเรื่องแบรนด์ภายในหนึ่งวัน',
    category: 'Identity · เครื่องมือธุรกิจ',
    location: 'ลานหน้าอาคาร BCA',
    monthOffset: 3,
    dims: d(0, 6, 6, 5, 0, 0, 0),
    identityLevel: 2,
    status: 'closed',
    joinCode: 'BOOTH2',
    capacity: 80,
  },
  {
    code: 'CONT',
    name: 'BCA Content Creator',
    description:
      'เวิร์กช็อปผลิตคอนเทนต์สั้นสำหรับแบรนด์ ตั้งแต่วางคอนเซ็ปต์ ถ่ายทำ ตัดต่อ จนถึงวัดผลบนโซเชียล',
    category: 'Identity · เครื่องมือสื่อสาร',
    location: 'Studio BCA อาคารนิเทศศาสตร์',
    monthOffset: 4,
    dims: d(0, 6, 0, 4, 7, 0, 0),
    identityLevel: 2,
    status: 'open',
    joinCode: 'CONT26',
    capacity: 50,
  },
  {
    code: 'YEC',
    name: 'BCA Young Entrepreneur Challenge',
    description:
      'แข่งขันออกแบบแผนธุรกิจและแผนสื่อสารครบวงจร นำเสนอต่อคณะกรรมการ พร้อมรับ feedback เชิงลึก',
    category: 'Identity · วางแผนธุรกิจ',
    location: 'อาคารเรียนรวมหลังใหม่',
    monthOffset: 5,
    dims: d(8, 7, 6, 0, 0, 0, 0),
    identityLevel: 3,
    status: 'closed',
    joinCode: 'YEC003',
    capacity: 120,
  },
  {
    code: 'SHOW',
    name: 'BCA Business Showcase',
    description:
      'จัดแสดงหลักฐานการทำธุรกิจจริงของนิสิต ทั้งยอดขาย ผลิตภัณฑ์ และการสื่อสารแบรนด์ต่อสาธารณะ',
    category: 'Identity · ลงมือทำธุรกิจ',
    location: 'UP Square',
    monthOffset: 10,
    dims: d(7, 8, 7, 6, 0, 0, 0),
    identityLevel: 4,
    status: 'open',
    joinCode: 'SHOW26',
    capacity: 150,
  },
  {
    code: 'INCU',
    name: 'BCA Startup Incubation',
    description:
      'โครงการบ่มเพาะธุรกิจ มีที่ปรึกษา ทำ Business Model Canvas ครบ และเริ่มแยกบัญชีธุรกิจอย่างเป็นระบบ',
    category: 'Identity · บ่มเพาะธุรกิจ',
    location: 'ศูนย์บ่มเพาะวิสาหกิจ มพ.',
    monthOffset: 8,
    dims: d(8, 8, 7, 7, 0, 5, 0),
    identityLevel: 5,
    status: 'closed',
    joinCode: 'INCU05',
    capacity: 40,
  },
  {
    code: 'EXPN',
    name: 'BCA Business Expansion',
    description:
      'ต่อยอดธุรกิจที่เดินได้ให้ขยายและจดทะเบียนจริง เชื่อมนักลงทุนและเครือข่ายผู้ประกอบการ',
    category: 'Identity · ขยายธุรกิจ',
    location: 'ศูนย์บ่มเพาะวิสาหกิจ มพ.',
    monthOffset: 9,
    dims: d(9, 9, 8, 8, 0, 6, 0),
    identityLevel: 6,
    status: 'closed',
    joinCode: 'EXPN06',
    capacity: 25,
  },

  // ── co-curricular (identityLevel = null) — ให้คะแนนโดเมน แต่ไม่ปลดระดับ ──
  {
    code: 'VOL',
    name: 'ค่ายอาสาพัฒนาชุมชนกว๊านพะเยา',
    description:
      'ลงพื้นที่ชุมชนรอบกว๊านพะเยา ช่วยพัฒนาแหล่งเรียนรู้และส่งเสริมเศรษฐกิจชุมชนร่วมกับชาวบ้าน',
    category: 'อาสา/บำเพ็ญประโยชน์',
    location: 'ชุมชนริมกว๊านพะเยา',
    monthOffset: 2,
    dims: d(0, 0, 5, 0, 0, 8, 6),
    identityLevel: null,
    status: 'closed',
    joinCode: 'VOL341',
    capacity: 60,
  },
  {
    code: 'BLOOD',
    name: 'บริจาคโลหิตเพื่อเพื่อนมนุษย์',
    description:
      'ร่วมบริจาคโลหิตกับสภากาชาดไทย ปลูกฝังจิตสาธารณะและการให้โดยไม่หวังผลตอบแทน',
    category: 'อาสา/บำเพ็ญประโยชน์',
    location: 'อาคารเรียนรวมหลังเก่า',
    monthOffset: 4,
    dims: d(0, 0, 0, 0, 0, 8, 5),
    identityLevel: null,
    status: 'closed',
    joinCode: 'BLD200',
  },
  {
    code: 'SPORT',
    name: 'กีฬาสีสัมพันธ์ BCA Games',
    description:
      'การแข่งขันกีฬาภายในคณะเชื่อมความสัมพันธ์ระหว่างสาขาและชั้นปี ส่งเสริมสุขภาวะและน้ำใจนักกีฬา',
    category: 'กีฬา/สุขภาพ',
    location: 'สนามกีฬากลาง มพ.',
    monthOffset: 5,
    dims: d(0, 0, 6, 0, 0, 0, 9),
    identityLevel: null,
    status: 'closed',
    joinCode: 'GAME26',
    capacity: 300,
  },
  {
    code: 'RUN',
    name: 'เดิน-วิ่งการกุศล BCA Charity Run',
    description:
      'กิจกรรมเดิน-วิ่งระดมทุนช่วยเหลือชุมชน ส่งเสริมสุขภาพและการทำความดีไปพร้อมกัน',
    category: 'กีฬา/สุขภาพ',
    location: 'รอบกว๊านพะเยา',
    monthOffset: 8,
    dims: d(0, 0, 0, 0, 0, 5, 9),
    identityLevel: null,
    status: 'closed',
    joinCode: 'RUN500',
    capacity: 250,
  },
  {
    code: 'CULT',
    name: 'Cultural Night: ดนตรีและการแสดง',
    description:
      'ค่ำคืนแห่งการแสดงดนตรี ละคร และศิลปะการแสดงของนิสิต เปิดพื้นที่ให้โชว์ความสามารถเต็มที่',
    category: 'ศิลปวัฒนธรรม',
    location: 'ลานกิจกรรม UP Square',
    monthOffset: 9,
    dims: d(0, 5, 0, 4, 9, 0, 0),
    identityLevel: null,
    status: 'closed',
    joinCode: 'CULT99',
  },
  {
    code: 'LOY',
    name: 'ลอยกระทงสืบสานศิลปวัฒนธรรม',
    description:
      'ร่วมสืบสานประเพณีลอยกระทง ประดิษฐ์กระทงจากวัสดุธรรมชาติ และการแสดงศิลปวัฒนธรรมล้านนา',
    category: 'ศิลปวัฒนธรรม',
    location: 'ลานสังคีต ริมกว๊านพะเยา',
    monthOffset: 3,
    dims: d(0, 0, 0, 4, 8, 0, 4),
    identityLevel: null,
    status: 'closed',
    joinCode: 'LOY118',
  },
  {
    code: 'PDPA',
    name: 'อบรมความปลอดภัยไซเบอร์ & PDPA',
    description:
      'เรียนรู้ภัยไซเบอร์ การคุ้มครองข้อมูลส่วนบุคคล และจริยธรรมการใช้ข้อมูลในโลกธุรกิจดิจิทัล',
    category: 'วิชาการ/ทักษะวิชาชีพ',
    location: 'อาคาร ICT',
    monthOffset: 7,
    dims: d(6, 0, 0, 0, 0, 7, 0),
    identityLevel: null,
    status: 'open',
    joinCode: 'PDPA26',
    capacity: 60,
  },
  {
    code: 'ENG',
    name: 'ค่ายภาษาอังกฤษเพื่อธุรกิจ',
    description:
      'ฝึกทักษะภาษาอังกฤษเชิงธุรกิจ ทั้งการนำเสนอ เจรจา และเขียนอีเมล กับวิทยากรเจ้าของภาษา',
    category: 'วิชาการ/ทักษะวิชาชีพ',
    location: 'อาคารเรียนรวม ห้อง PKY',
    monthOffset: 6,
    dims: d(5, 7, 0, 0, 0, 0, 0),
    identityLevel: null,
    status: 'closed',
    joinCode: 'ENG404',
    capacity: 50,
  },
  {
    code: 'TEACH',
    name: 'จิตอาสาสอนน้องรู้ทันการเงิน',
    description:
      'นิสิตอาสาไปสอนความรู้การเงินพื้นฐานและการออมให้นักเรียนในอำเภอเมืองพะเยา ฝึกวินัยและความรับผิดชอบ',
    category: 'อาสา/บำเพ็ญประโยชน์',
    location: 'โรงเรียนในเขตอำเภอเมืองพะเยา',
    monthOffset: 8,
    dims: d(5, 0, 5, 7, 0, 6, 0),
    identityLevel: null,
    status: 'closed',
    joinCode: 'TCH150',
    capacity: 40,
  },
  {
    code: 'TREE',
    name: 'ปลูกป่าและฟื้นฟูสิ่งแวดล้อม',
    description:
      'ร่วมปลูกต้นไม้และฟื้นฟูพื้นที่สีเขียว สร้างจิตสำนึกรักษ์สิ่งแวดล้อมและความยั่งยืน',
    category: 'อาสา/บำเพ็ญประโยชน์',
    location: 'พื้นที่อนุรักษ์ดอยหลวง',
    monthOffset: 1,
    dims: d(0, 0, 4, 0, 0, 7, 6),
    identityLevel: null,
    status: 'closed',
    joinCode: 'TREE31',
  },
]

// ตัวแทนบันไดต่อระดับ (leveling) + pool ของ filler co-curricular (ไม่ปลดระดับ)
const LADDER_PRIMARY: Record<number, string> = {
  1: 'INSP',
  2: 'STCK',
  3: 'YEC',
  4: 'SHOW',
  5: 'INCU',
  6: 'EXPN',
}
const FILLERS = ['VOL', 'BLOOD', 'SPORT', 'RUN', 'CULT', 'LOY', 'PDPA', 'ENG', 'TEACH', 'TREE']

// เดือนอ้างอิงเริ่ม ส.ค. 2025 (ปีการศึกษา 2568)
function activityDate(monthOffset: number, day: number, hour: number): string {
  const base = new Date(2025, 7, 1)
  const dt = new Date(base.getFullYear(), base.getMonth() + monthOffset, day, hour, 0, 0)
  return dt.toISOString()
}

// ── นิสิต "rich" ~12 คน — participation เต็ม (drill-down/portfolio) ──
interface RichDef {
  majorCode: MajorCode
  ladderTo: number // ทำบันไดถึงระดับนี้
  fillers: string[] // co-curricular ที่ทำ (คุมรูปทรงเรดาร์)
}
const RICH_DEFS: RichDef[] = [
  { majorCode: 'ComM', ladderTo: 6, fillers: ['CONT', 'CULT', 'VOL', 'PDPA', 'ENG', 'SPORT'] }, // รอบด้าน
  { majorCode: 'ComM', ladderTo: 5, fillers: ['CONT', 'CULT', 'LOY', 'ENG'] }, // สื่อสาร/สร้างสรรค์
  { majorCode: 'ECON', ladderTo: 6, fillers: ['PDPA', 'ENG', 'VOL'] }, // วิเคราะห์/ความรู้แหลม
  { majorCode: 'F&I', ladderTo: 5, fillers: ['STCK', 'PDPA', 'ENG', 'SPORT'] }, // การเงิน
  { majorCode: 'F&I', ladderTo: 6, fillers: ['PDPA', 'BOOTH', 'VOL', 'RUN'] },
  { majorCode: 'ACC', ladderTo: 5, fillers: ['PDPA', 'ENG', 'TEACH'] },
  { majorCode: 'BMG', ladderTo: 6, fillers: ['BOOTH', 'ENG', 'VOL', 'SPORT'] },
  { majorCode: 'DMKT', ladderTo: 5, fillers: ['CONT', 'CULT', 'PDPA', 'LOY'] }, // ดิจิทัล/ครีเอทีฟ
  { majorCode: 'NMC', ladderTo: 4, fillers: ['CONT', 'CULT', 'LOY'] }, // สื่อใหม่/สุนทรีย์แหลม
  { majorCode: 'NMC', ladderTo: 3, fillers: ['CONT', 'CULT'] },
  { majorCode: 'TR&H', ladderTo: 4, fillers: ['CULT', 'LOY', 'VOL', 'SPORT', 'RUN'] }, // ท่องเที่ยว/สุขภาวะ+สุนทรีย์
  { majorCode: 'TR&H', ladderTo: 3, fillers: ['LOY', 'SPORT', 'VOL'] },
]

const ENGAGEMENT_SPREAD = 0.42

// strengthOverride: ใช้เฉพาะตอนคาลิเบรต (scripts/tune-seed) — prod เรียก buildSeed() เปล่า
export function buildSeed(
  strengthOverride?: Partial<Record<MajorCode, number>>,
): PersistedState {
  const rng = mulberry32(20690705)

  // ── activities ──
  const activities: Activity[] = ACTIVITY_DEFS.map((def, i) => {
    const startDay = randInt(rng, 3, 25)
    const startHour = randInt(rng, 8, 15)
    const start = activityDate(def.monthOffset, startDay, startHour)
    const end = activityDate(def.monthOffset, startDay, startHour + randInt(rng, 2, 6))
    return {
      id: `ac-${String(i + 1).padStart(2, '0')}`,
      code: `ACT-${def.code}`,
      name: def.name,
      description: def.description,
      facultyId: BCA.id,
      category: def.category,
      startAt: start,
      endAt: end,
      location: def.location,
      capacity: def.capacity,
      dims: def.dims,
      identityLevel: def.identityLevel,
      joinCode: def.joinCode,
      status: def.status,
      createdAt: activityDate(def.monthOffset, 1, 9),
    }
  })
  const byCode = (c: string) => activities.find((a) => a.code === `ACT-${c}`)!

  // ── students (434 ตามสัดส่วนสาขา) ──
  const students: Student[] = []
  const usedNames = new Set<string>()
  // ชั้นปี: กระจาย 4 ปี เท่า ๆ กัน (enrolledYear ค.ศ. 2023–2026)
  const enrollYears = [2023, 2024, 2025, 2026]
  let seq = 1

  // จองช่อง rich ต่อสาขา (index 0..k-1 ของสาขานั้นเป็น rich)
  const richQuotaByMajor = new Map<MajorCode, number>()
  for (const r of RICH_DEFS)
    richQuotaByMajor.set(r.majorCode, (richQuotaByMajor.get(r.majorCode) ?? 0) + 1)

  for (const m of MAJORS) {
    const richLeft = { n: richQuotaByMajor.get(m.code) ?? 0 }
    for (let j = 0; j < m.n; j++) {
      const isMale = rng() < 0.42
      let firstName = ''
      let lastName = ''
      let guard = 0
      do {
        firstName = pick(rng, isMale ? MALE_FIRST : FEMALE_FIRST)
        lastName = pick(rng, LAST)
        guard++
      } while (usedNames.has(firstName + lastName) && guard < 60)
      usedNames.add(firstName + lastName)

      const enrolledYear = enrollYears[j % 4]
      const be2 = (enrolledYear + 543) % 100
      const year = clamp(2026 - enrolledYear + 1, 1, 4)
      const studentCode = `${be2}${m.codeNum}${String(seq).padStart(4, '0')}`
      const isRich = richLeft.n > 0
      if (isRich) richLeft.n--
      seq++

      students.push({
        id: `st-${String(seq - 1).padStart(4, '0')}`,
        studentCode,
        title: isMale ? 'นาย' : 'นางสาว',
        firstName,
        lastName,
        facultyId: BCA.id,
        major: m.name,
        majorCode: m.code,
        year,
        enrolledYear,
        avatarHue: Math.floor(rng() * 360),
        rich: isRich || undefined,
      })
    }
  }

  // ── participations ──
  const participations: Participation[] = []
  let pid = 1
  const addParticipation = (
    studentId: string,
    activity: Activity,
    completed: boolean,
  ) => {
    const base = new Date(activity.startAt)
    // checkin แบบ deterministic (ไม่กิน shared rng) → ปรับ strength ไม่ทำ stream เลื่อน
    // ทำให้แต่ละสาขา decouple + คาลิเบรตเสถียรต่อการปัดเศษ
    const checkin = new Date(base.getTime() + ((pid * 7) % 41) * 60000)
    participations.push({
      id: `pa-${String(pid).padStart(6, '0')}`,
      studentId,
      activityId: activity.id,
      checkinAt: checkin.toISOString(),
      status: completed ? 'completed' : 'checked_in',
      dimsSnapshot: { ...activity.dims },
      identityLevel: activity.identityLevel,
    })
    pid++
  }
  const joinCodes = (codes: string[], studentId: string) => {
    for (const c of codes) {
      const act = byCode(c)
      addParticipation(studentId, act, act.status !== 'open')
    }
  }

  const richByMajorQueue = new Map<MajorCode, RichDef[]>()
  for (const r of RICH_DEFS) {
    const arr = richByMajorQueue.get(r.majorCode) ?? []
    arr.push(r)
    richByMajorQueue.set(r.majorCode, arr)
  }

  const majorStrength = new Map<MajorCode, number>(
    MAJORS.map((m) => [m.code, strengthOverride?.[m.code] ?? m.strength]),
  )

  students.forEach((st, i) => {
    // rng ต่อคนแบบ fixed-consumption (3 ค่า) เพื่อให้ปรับ strength ไม่ทำ stream เลื่อน
    const u1 = rng()
    const u2 = rng()
    const u3 = rng()

    if (st.rich) {
      const queue = richByMajorQueue.get(st.majorCode)!
      const def = queue.shift()!
      const codes: string[] = []
      for (let lv = 1; lv <= def.ladderTo; lv++) codes.push(LADDER_PRIMARY[lv])
      codes.push(...def.fillers)
      joinCodes([...new Set(codes)], st.id)
      return
    }

    const s = majorStrength.get(st.majorCode)!
    const e = clamp(s + (u1 - 0.5) * ENGAGEMENT_SPREAD, 0, 1)
    const level = clamp(Math.round(0.6 + e * 5.4 + (u2 - 0.5) * 0.8), 1, 6)
    const coExtra = clamp(Math.round(e * 5.5 + (u3 - 0.5) * 1.6), 0, FILLERS.length)

    const codes: string[] = []
    for (let lv = 1; lv <= level; lv++) codes.push(LADDER_PRIMARY[lv])
    // เลือก filler แบบ rotation ตาม index (ไม่กิน rng เพิ่ม → tuning เสถียร)
    for (let k = 0; k < coExtra; k++) {
      codes.push(FILLERS[(i * 3 + level + k) % FILLERS.length])
    }
    joinCodes([...new Set(codes)], st.id)
  })

  return { faculties: [BCA], students, activities, participations }
}
