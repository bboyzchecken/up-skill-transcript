import type {
  Activity,
  Dims,
  Faculty,
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

const d = (
  knowledge: number,
  skills: number,
  attitude: number,
  ethics: number,
  aesthetics: number,
  wellness: number,
): Dims => ({ knowledge, skills, attitude, ethics, aesthetics, wellness })

// ── คณะ BCA (โฟกัสคณะเดียวตาม decision §13.5) ──
const BCA: Faculty = {
  id: 'fac-bca',
  name: 'คณะบริหารธุรกิจและนิเทศศาสตร์',
  nameEn: 'School of Business and Communication Arts',
  abbr: 'BCA',
}

interface MajorDef {
  name: string
  code: string
}
const MAJORS: MajorDef[] = [
  { name: 'การจัดการธุรกิจ', code: '11' },
  { name: 'การเงินและการลงทุน', code: '12' },
  { name: 'การตลาดดิจิทัล', code: '13' },
  { name: 'การท่องเที่ยวและการโรงแรม', code: '14' },
  { name: 'บัญชี', code: '15' },
  { name: 'การสื่อสารสื่อใหม่', code: '16' },
]

// ── กิจกรรม (dims กำหนดมือให้รูปทรงคะแนนมีความหมาย) ──
interface ActivityDef {
  code: string
  name: string
  description: string
  category: string
  location: string
  monthOffset: number // เดือนนับจาก ส.ค. 2025
  dims: Dims
  status: Activity['status']
  joinCode: string
  capacity?: number
}

const ACTIVITY_DEFS: ActivityDef[] = [
  {
    code: 'ACT-ORI',
    name: 'ปฐมนิเทศนิสิตใหม่ BCA ประจำปี',
    description:
      'ต้อนรับนิสิตใหม่คณะบริหารธุรกิจและนิเทศศาสตร์ แนะนำหลักสูตร ระบบพี่รหัส และกิจกรรมพัฒนานิสิตตลอดปีการศึกษา',
    category: 'ปฐมนิเทศ',
    location: 'หอประชุมพญางำเมือง',
    monthOffset: 0,
    dims: d(5, 2, 8, 3, 3, 6),
    status: 'closed',
    joinCode: 'ORI690',
    capacity: 400,
  },
  {
    code: 'ACT-VOL',
    name: 'ค่ายอาสาพัฒนาชุมชนกว๊านพะเยา',
    description:
      'ลงพื้นที่ชุมชนรอบกว๊านพะเยา ช่วยพัฒนาแหล่งเรียนรู้และส่งเสริมเศรษฐกิจชุมชนร่วมกับชาวบ้าน',
    category: 'อาสา/บำเพ็ญประโยชน์',
    location: 'ชุมชนริมกว๊านพะเยา',
    monthOffset: 2,
    dims: d(3, 5, 8, 9, 3, 7),
    status: 'closed',
    joinCode: 'VOL341',
    capacity: 60,
  },
  {
    code: 'ACT-HACK',
    name: 'BCA Hackathon: Business Solution',
    description:
      'แข่งขันพัฒนาโซลูชันธุรกิจภายใน 24 ชั่วโมง ใช้ข้อมูลจริงจากผู้ประกอบการท้องถิ่นมาแก้โจทย์',
    category: 'วิชาการ/ทักษะวิชาชีพ',
    location: 'อาคารเรียนรวมหลังใหม่ ห้อง CE',
    monthOffset: 3,
    dims: d(9, 9, 5, 3, 4, 3),
    status: 'closed',
    joinCode: 'HACK55',
    capacity: 80,
  },
  {
    code: 'ACT-UXUI',
    name: 'UX/UI Design Workshop',
    description:
      'เวิร์กช็อปออกแบบประสบการณ์ผู้ใช้และหน้าจอ ตั้งแต่ research จนถึง prototype บน Figma',
    category: 'วิชาการ/ทักษะวิชาชีพ',
    location: 'Studio BCA อาคารนิเทศศาสตร์',
    monthOffset: 4,
    dims: d(6, 9, 5, 3, 8, 3),
    status: 'closed',
    joinCode: 'UXUI72',
    capacity: 40,
  },
  {
    code: 'ACT-LOY',
    name: 'ลอยกระทงสืบสานศิลปวัฒนธรรม',
    description:
      'ร่วมสืบสานประเพณีลอยกระทง ประดิษฐ์กระทงจากวัสดุธรรมชาติ และการแสดงศิลปวัฒนธรรมล้านนา',
    category: 'ศิลปวัฒนธรรม',
    location: 'ลานสังคีต ริมกว๊านพะเยา',
    monthOffset: 3,
    dims: d(3, 4, 6, 4, 9, 5),
    status: 'closed',
    joinCode: 'LOY118',
  },
  {
    code: 'ACT-SPORT',
    name: 'กีฬาสีสัมพันธ์ BCA Games',
    description:
      'การแข่งขันกีฬาภายในคณะเชื่อมความสัมพันธ์ระหว่างสาขาและชั้นปี ส่งเสริมสุขภาวะและน้ำใจนักกีฬา',
    category: 'กีฬา/สุขภาพ',
    location: 'สนามกีฬากลาง มหาวิทยาลัยพะเยา',
    monthOffset: 5,
    dims: d(2, 4, 7, 4, 4, 9),
    status: 'closed',
    joinCode: 'GAME26',
    capacity: 300,
  },
  {
    code: 'ACT-BLOOD',
    name: 'บริจาคโลหิตเพื่อเพื่อนมนุษย์',
    description:
      'ร่วมบริจาคโลหิตกับสภากาชาดไทย ปลูกฝังจิตสาธารณะและการให้โดยไม่หวังผลตอบแทน',
    category: 'อาสา/บำเพ็ญประโยชน์',
    location: 'อาคารเรียนรวมหลังเก่า ชั้น 1',
    monthOffset: 4,
    dims: d(3, 2, 6, 8, 2, 6),
    status: 'closed',
    joinCode: 'BLD200',
  },
  {
    code: 'ACT-SEM',
    name: 'สัมมนาวิชาการ: เศรษฐกิจดิจิทัลไทย',
    description:
      'ฟังมุมมองจากผู้บริหารและนักวิชาการด้านเศรษฐกิจดิจิทัล พร้อมเสวนาแนวโน้มธุรกิจยุคใหม่',
    category: 'วิชาการ/ทักษะวิชาชีพ',
    location: 'ห้องประชุมเมืองพะเยา',
    monthOffset: 6,
    dims: d(9, 4, 5, 3, 3, 3),
    status: 'closed',
    joinCode: 'SEM808',
    capacity: 200,
  },
  {
    code: 'ACT-ENG',
    name: 'ค่ายภาษาอังกฤษเพื่อธุรกิจ',
    description:
      'ฝึกทักษะภาษาอังกฤษเชิงธุรกิจ ทั้งการนำเสนอ เจรจา และเขียนอีเมล กับวิทยากรเจ้าของภาษา',
    category: 'วิชาการ/ทักษะวิชาชีพ',
    location: 'อาคารเรียนรวม ห้อง PKY',
    monthOffset: 7,
    dims: d(7, 7, 6, 3, 3, 3),
    status: 'closed',
    joinCode: 'ENG404',
    capacity: 50,
  },
  {
    code: 'ACT-PITCH',
    name: 'BCA Startup Pitching Day',
    description:
      'เวทีนำเสนอไอเดียธุรกิจต่อคณะกรรมการและนักลงทุน ฝึกการพิตช์ การเงิน และการสื่อสารแบรนด์',
    category: 'วิชาการ/ทักษะวิชาชีพ',
    location: 'หอประชุมพญางำเมือง',
    monthOffset: 10,
    dims: d(7, 8, 7, 3, 5, 3),
    status: 'open',
    joinCode: 'PITCH26',
    capacity: 120,
  },
  {
    code: 'ACT-TEACH',
    name: 'จิตอาสาสอนน้องรู้ทันการเงิน',
    description:
      'นิสิตอาสาไปสอนความรู้การเงินพื้นฐานและการออมให้นักเรียนโรงเรียนในอำเภอเมืองพะเยา',
    category: 'อาสา/บำเพ็ญประโยชน์',
    location: 'โรงเรียนในเขตอำเภอเมืองพะเยา',
    monthOffset: 8,
    dims: d(5, 6, 7, 8, 3, 4),
    status: 'closed',
    joinCode: 'TCH150',
    capacity: 40,
  },
  {
    code: 'ACT-CULT',
    name: 'Cultural Night: ดนตรีและการแสดง',
    description:
      'ค่ำคืนแห่งการแสดงดนตรี ละคร และศิลปะการแสดงของนิสิต เปิดพื้นที่ให้โชว์ความสามารถเต็มที่',
    category: 'ศิลปวัฒนธรรม',
    location: 'ลานกิจกรรม UP Square',
    monthOffset: 9,
    dims: d(3, 7, 6, 3, 9, 6),
    status: 'closed',
    joinCode: 'CULT99',
  },
  {
    code: 'ACT-CYBER',
    name: 'อบรมความปลอดภัยไซเบอร์ & PDPA',
    description:
      'เรียนรู้ภัยไซเบอร์ การคุ้มครองข้อมูลส่วนบุคคล และจริยธรรมการใช้ข้อมูลในโลกธุรกิจดิจิทัล',
    category: 'วิชาการ/ทักษะวิชาชีพ',
    location: 'อาคาร ICT ห้องปฏิบัติการคอมพิวเตอร์',
    monthOffset: 9,
    dims: d(8, 4, 4, 7, 2, 3),
    status: 'open',
    joinCode: 'CYBER7',
    capacity: 60,
  },
  {
    code: 'ACT-RUN',
    name: 'เดิน-วิ่งการกุศล BCA Charity Run',
    description:
      'กิจกรรมเดิน-วิ่งระดมทุนช่วยเหลือชุมชน ส่งเสริมสุขภาพและการทำความดีไปพร้อมกัน',
    category: 'กีฬา/สุขภาพ',
    location: 'รอบกว๊านพะเยา',
    monthOffset: 8,
    dims: d(2, 3, 5, 6, 4, 9),
    status: 'closed',
    joinCode: 'RUN500',
    capacity: 250,
  },
  {
    code: 'ACT-TREE',
    name: 'ปลูกป่าและฟื้นฟูสิ่งแวดล้อม',
    description:
      'ร่วมปลูกต้นไม้และฟื้นฟูพื้นที่สีเขียว สร้างจิตสำนึกรักษ์สิ่งแวดล้อมและความยั่งยืน',
    category: 'อาสา/บำเพ็ญประโยชน์',
    location: 'พื้นที่อนุรักษ์ดอยหลวง',
    monthOffset: 1,
    dims: d(3, 4, 6, 8, 4, 7),
    status: 'closed',
    joinCode: 'TREE31',
  },
]

// เดือนอ้างอิงเริ่ม ส.ค. 2025 (ปีการศึกษา 2568)
function activityDate(monthOffset: number, day: number, hour: number): string {
  const base = new Date(2025, 7, 1) // ส.ค. 2025
  const dt = new Date(
    base.getFullYear(),
    base.getMonth() + monthOffset,
    day,
    hour,
    0,
    0,
  )
  return dt.toISOString()
}

export function buildSeed(): PersistedState {
  const rng = mulberry32(20690705)

  // ── activities ──
  const activities: Activity[] = ACTIVITY_DEFS.map((def, i) => {
    const startDay = randInt(rng, 3, 25)
    const startHour = randInt(rng, 8, 15)
    const start = activityDate(def.monthOffset, startDay, startHour)
    const end = activityDate(def.monthOffset, startDay, startHour + randInt(rng, 2, 6))
    return {
      id: `ac-${String(i + 1).padStart(2, '0')}`,
      code: def.code,
      name: def.name,
      description: def.description,
      facultyId: BCA.id,
      category: def.category,
      startAt: start,
      endAt: end,
      location: def.location,
      capacity: def.capacity,
      dims: def.dims,
      joinCode: def.joinCode,
      status: def.status,
      createdAt: activityDate(def.monthOffset, 1, 9),
    }
  })
  const byCode = (c: string) => activities.find((a) => a.code === c)!

  // ── students ──
  const students: Student[] = []
  const usedNames = new Set<string>()
  const total = 48
  // กระจายชั้นปี: enrolledYear (ค.ศ.) 2023–2026 → ปี 4..1 ในปี 2026
  const enrollDist = [
    2023, 2023, 2023, 2023, 2023, 2023, 2023, 2023, 2023, 2023, 2023, 2023,
    2024, 2024, 2024, 2024, 2024, 2024, 2024, 2024, 2024, 2024, 2024, 2024,
    2025, 2025, 2025, 2025, 2025, 2025, 2025, 2025, 2025, 2025, 2025, 2025,
    2026, 2026, 2026, 2026, 2026, 2026, 2026, 2026, 2026, 2026, 2026, 2026,
  ]
  let seq = 1
  for (let i = 0; i < total; i++) {
    const isMale = rng() < 0.42
    let firstName = ''
    let lastName = ''
    let guard = 0
    do {
      firstName = pick(rng, isMale ? MALE_FIRST : FEMALE_FIRST)
      lastName = pick(rng, LAST)
      guard++
    } while (usedNames.has(firstName + lastName) && guard < 50)
    usedNames.add(firstName + lastName)

    const major = MAJORS[i % MAJORS.length]
    const enrolledYear = enrollDist[i]
    const be2 = (enrolledYear + 543) % 100
    const year = Math.min(4, Math.max(1, 2026 - enrolledYear + 1))
    const studentCode = `${be2}${major.code}${String(seq).padStart(4, '0')}`
    seq++

    students.push({
      id: `st-${String(i + 1).padStart(4, '0')}`,
      studentCode,
      title: isMale ? 'นาย' : 'นางสาว',
      firstName,
      lastName,
      facultyId: BCA.id,
      major: major.name,
      year,
      enrolledYear,
      avatarHue: Math.floor(rng() * 360),
    })
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
    const checkin = new Date(base.getTime() + randInt(rng, 0, 40) * 60000)
    participations.push({
      id: `pa-${String(pid).padStart(6, '0')}`,
      studentId,
      activityId: activity.id,
      checkinAt: checkin.toISOString(),
      status: completed ? 'completed' : 'checked_in',
      dimsSnapshot: { ...activity.dims }, // สแนปช็อตตอนเข้าร่วม
    })
    pid++
  }

  // นิสิต "ตัวอย่างเด่น" 4 คนแรก — curate ให้เรดาร์เล่าเรื่องได้ตอน pitch
  const stars: Record<number, string[]> = {
    // 0: รอบด้าน (balance สูง)
    0: [
      'ACT-ORI',
      'ACT-VOL',
      'ACT-HACK',
      'ACT-UXUI',
      'ACT-SPORT',
      'ACT-SEM',
      'ACT-CULT',
      'ACT-TEACH',
      'ACT-RUN',
      'ACT-LOY',
    ],
    // 1: สายวิเคราะห์/เทค (Knowledge + Skills แหลม)
    1: ['ACT-HACK', 'ACT-UXUI', 'ACT-SEM', 'ACT-ENG', 'ACT-CYBER', 'ACT-ORI'],
    // 2: สายอาสา/ผู้นำ (Ethics + Attitude + Wellness)
    2: [
      'ACT-VOL',
      'ACT-BLOOD',
      'ACT-RUN',
      'ACT-TREE',
      'ACT-TEACH',
      'ACT-SPORT',
      'ACT-ORI',
    ],
    // 3: สายสร้างสรรค์ (Aesthetics + Skills)
    3: ['ACT-CULT', 'ACT-UXUI', 'ACT-LOY', 'ACT-PITCH', 'ACT-ORI'],
  }
  for (const [idxStr, codes] of Object.entries(stars)) {
    const st = students[Number(idxStr)]
    for (const code of codes) {
      const act = byCode(code)
      addParticipation(st.id, act, act.status !== 'open')
    }
  }

  // นิสิตที่เหลือ — สุ่มจำนวนกิจกรรมไม่เท่ากัน (บางคนรอบด้าน บางคนน้อย)
  const closedActs = activities.filter((a) => a.status === 'closed')
  const openActs = activities.filter((a) => a.status === 'open')
  for (let i = 4; i < students.length; i++) {
    const st = students[i]
    // จำนวนกิจกรรมแบบเบ้ (ส่วนใหญ่ 3–7 บางคนสูง/ต่ำ)
    const r = rng()
    const n =
      r < 0.15 ? randInt(rng, 1, 2) : r < 0.8 ? randInt(rng, 3, 7) : randInt(rng, 8, 11)
    // เลือกกิจกรรมแบบมี "ความชอบ" — สุ่มด้านที่นิสิตคนนี้ถนัดแล้ว weight
    const shuffled = [...closedActs].sort(() => rng() - 0.5)
    const chosen = shuffled.slice(0, Math.min(n, shuffled.length))
    for (const act of chosen) addParticipation(st.id, act, true)
    // บางคนเช็กอินกิจกรรมที่ยังเปิดอยู่ (ยังไม่ completed) เพื่อให้ list มีคนอยู่แล้ว
    if (openActs.length && rng() < 0.35) {
      const act = pick(rng, openActs)
      const dup = participations.some(
        (p) => p.studentId === st.id && p.activityId === act.id,
      )
      if (!dup) addParticipation(st.id, act, false)
    }
  }

  return { faculties: [BCA], students, activities, participations }
}
