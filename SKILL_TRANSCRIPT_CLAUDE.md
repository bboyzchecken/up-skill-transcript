# CLAUDE.md — Skill Transcript Demo (ม.พะเยา)

> วางไฟล์นี้เป็น `CLAUDE.md` ที่ root ของโปรเจกต์ แล้วเริ่มที่ **M0 (§9)** ก่อนเสมอ
> ทุกคำสั่ง/คำอธิบายในนี้เป็น instruction ให้ Claude Code build เดโม่

---

## 1. คุณกำลังสร้างอะไร

เดโม่ **"ระบบทรานสคริปต์ทักษะ" (Skill Transcript)** สำหรับ *นำเสนอปิดการขายให้มหาวิทยาลัยพะเยา* — ไม่ใช่ระบบ production

**แก่นคอนเซปต์:** นิสิตเข้าร่วมกิจกรรมคณะ → แต่ละกิจกรรมให้คะแนน **6 ด้าน** (Knowledge / Skills / Attitude / Ethics / Aesthetics / Wellness) → พอจะจบ ป.ตรี สรุปเป็น **เรดาร์ใยแมงมุม 6 แกน** บอกว่านิสิตคนนี้เด่นด้านไหน

**เดโม่ต้องพิสูจน์ 3 อย่างใน 5 นาที:** (1) นิสิตใช้ง่าย—สแกนจบ (2) เจ้าหน้าที่สร้างกิจกรรม+ดูคนเข้าร่วมสด ๆ ง่าย (3) มี "ของ" ที่ระบบอื่นไม่มี = transcript เรดาร์ที่เล่าเรื่องเด็กได้

**เป้าคุณภาพ:** ต้องดู "เป็นระบบจริงของมหาลัย" ไม่ใช่ mockup — ข้อมูลแน่น, ดีไซน์มีคาแรกเตอร์, motion เบา

---

## 2. Scope (อ่านก่อนเขียนโค้ด — กันงานบาน)

**ทำ ✅**
- สร้าง/แก้/ดูกิจกรรม + ตั้งน้ำหนักคะแนน 6 ด้าน (สไลเดอร์ + มินิเรดาร์ preview)
- QR + join code ต่อกิจกรรม
- นิสิตสแกน/กรอกโค้ด → เข้าร่วม → ชื่อเด้งเข้ารายชื่อ (เรียลไทม์)
- รายชื่อผู้เข้าร่วมต่อกิจกรรม (อัปเดตสด)
- **หน้า Transcript นิสิต = เรดาร์ 6 แกน** + จุดเด่น/ควรเสริม + balance score + รายการกิจกรรม
- Dashboard กิจการนิสิต: KPI + กราฟภาพรวม + ค้นหา/ตารางนิสิต drill-down + วิเคราะห์ด้าน under-served
- Seed data สมจริง + ปุ่ม reset/seed

**ไม่ทำ ❌ (จำลอง/ข้ามไป — เพราะเป็นเดโม่)**
- ไม่ต่อ SSO / ทะเบียนนิสิตจริง / ระบบกลางจริง → **จำลองด้วย store ของเราเอง**
- ไม่ทำ auth จริง → "เลือก role / เลือกว่าเป็นใคร" ไม่มีรหัสผ่าน
- ไม่ทำเวิร์กโฟลว์อนุมัติ, ออกใบจริง, ชำระเงิน, push notification, export PDF
- ไม่ทำแอป native → ใช้ web mobile-first แทน "แอปมหาลัยสมมุติ"

---

## 3. Tech Stack

- **React + Vite + TypeScript**
- Routing: React Router · State: Zustand (หรือ Context) เบา ๆ
- Charts: **Recharts** (radar/bar/line) — ถ้า radar ไม่พอค่อย hand-roll SVG
- QR: `qrcode` (สร้าง) + `html5-qrcode` หรือ `@zxing/browser` (อ่าน)
- Styling: Tailwind (หรือ CSS modules) — ให้ดีไซน์ตาม §7
- ไม่ใช้ localStorage/sessionStorage ใน artifact ของ claude.ai — แต่โปรเจกต์นี้เป็นแอป Vite รันจริง **ใช้ localStorage ได้ปกติ**

---

## 4. หัวใจสถาปัตยกรรม: Store แบบสลับได้

UI **ห้ามแตะ storage ตรง ๆ** ให้เรียกผ่าน interface เดียว เพื่อสลับ localStorage ↔ backend ได้โดยไม่แก้หน้าจอ

```ts
interface Store {
  // activities
  listActivities(): Promise<Activity[]>
  getActivity(id: string): Promise<Activity | null>
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
}
```

- **impl หลักตอนนี้ = `LocalStore`** (localStorage) → พัฒนา + เดโม่จอเดียว/2 แท็บ
- **`ApiStore`** (fetch → backend จิ๋ว) = ทำทีหลังใน **M6** เพื่อโมเมนต์ "มือถือสแกน → เด้งขึ้นจอ" ข้ามเครื่อง
- เลือก impl ผ่าน env/config ตัวเดียว (`VITE_STORE=local|api`)

**Backend จิ๋ว (M6 เท่านั้น):** Node + Express + `better-sqlite3` (หรือ lowdb/JSON) · endpoints map 1:1 กับ `Store` · realtime แบบง่าย = ฝั่งรายชื่อ/dashboard **poll ทุก 2–3 วิ** (ไม่ต้องทำ websocket) · มือถือต่อผ่าน LAN IP

---

## 5. Data Model

```ts
type Dims = { knowledge:number; skills:number; attitude:number;
              ethics:number; aesthetics:number; wellness:number } // 0–10 ต่อด้าน

Faculty       { id, name, nameEn }
Student       { id, studentCode, title, firstName, lastName,
                facultyId, major, year, enrolledYear, avatarUrl? }
Activity      { id, code, name, description, facultyId, category?,
                startAt, endAt, location, capacity?, dims: Dims,
                joinCode, status: 'draft'|'open'|'closed', createdAt }
Participation { id, studentId, activityId, checkinAt,
                status: 'checked_in'|'completed',
                dimsSnapshot: Dims }   // ⚠️ สแนปช็อตตอนเข้าร่วม
Transcript    { studentId, totals: Dims, top2: string[], bottom2: string[],
                balanceScore: number, activities: Participation[], persona? }
```

**การคำนวณ:**
- `totals.X` = ผลรวม `dimsSnapshot.X` ของ participation ที่ `completed`
- เรดาร์: axis max = ค่าสูงสุดใน cohort ต่อด้าน (ให้รูปทรงเทียบกันได้)
- `top2/bottom2` = 2 ด้านสูงสุด/ต่ำสุด
- `balanceScore` = 0–100 วัดความสม่ำเสมอ 6 ด้าน (เช่น `100 − normalizedStdDev`)

---

## 6. หน้าจอที่ต้องมี

**Organizer** (`/staff`)
- Role select (ไม่มีรหัสผ่าน) · Activities list (สถานะ + #คนเข้าร่วม)
- Create/Edit activity: ฟอร์ม + **สไลเดอร์ 6 ด้าน + มินิเรดาร์ preview สด**
- Activity detail: **QR ใหญ่ (ไว้ฉายจอ)**, join code, **รายชื่อผู้เข้าร่วมอัปเดตสด**, สถิติ

**นิสิต mobile-first** (`/join`, `/me`)
- Scan/Join: สแกนหรือกรอกโค้ด → **เลือกว่าเป็นใคร (ค้นชื่อ/dropdown)** → ยืนยัน → success + preview ด้านที่ได้
- My Transcript: **เรดาร์ 6 แกน (วาดด้วย animation)** + จุดเด่น/ควรเสริม + balance + รายการกิจกรรม + (optional) ฉายา

**กองกิจการนิสิต** (`/dashboard`)
- Overview: KPI (นิสิตมีส่วนร่วม / กิจกรรมทั้งหมด / เช็กอินรวม / เฉลี่ยกิจกรรมต่อคน) + count-up
- กราฟ: การเข้าร่วมตามเวลา · การกระจาย 6 ด้านทั้ง cohort · กิจกรรมยอดนิยม · แยกคณะ/ชั้นปี
- Students table: ค้นหา → คลิกเข้า transcript รายคน
- Activities analytics: ด้านไหน **under-served** ทั้งมหาลัย (ใช้ขายจุดวางแผนพัฒนานิสิต)

**Admin เบา** — ปุ่ม seed/reset สำหรับเดโม่ซ้ำ

---

## 7. Design Rules (ทำให้ "ไม่ดูเป็น AI")

```
ไม่ดูเป็น AI = ข้อมูลจริง + signature ผูกโดเมน + ฟอนต์มีคาแรกเตอร์
             + SVG จริง (ไม่ใช้ emoji) + เลี่ยง 3 default look + motion เบา
```
- **Signature = เรดาร์/ใยแมงมุม + constellation** ทำเป็น motif ทั้งระบบ (พื้นหลังจาง, ไอคอน 6 ด้าน = SVG สะอาด)
- **ฟอนต์:** display = Kanit / Space Grotesk · body = IBM Plex Sans Thai · ตัวเลข/โค้ด = IBM Plex Mono
- **สี:** ธีม **ม่วง–ทอง (มพ.)** เป็นหลัก + **สีประจำ 6 ด้าน** (คงเส้นคงวาในเรดาร์/กราฟ/แท็ก):
  - Knowledge `#3B82F6` · Skills `#14B8A6` · Attitude `#F59E0B` · Ethics `#8B5CF6` · Aesthetics `#EC4899` · Wellness `#10B981`
  - *(สีทางการ มพ. ให้เจ้าของโปรเจกต์ยืนยันก่อนล็อก)*
- **เลี่ยง 3 ลุค default:** ครีม+เซอริฟ+terracotta / ดำ+เขียวสะท้อนแสง / หนังสือพิมพ์เส้นบาง
- **Motion เบา:** เรดาร์วาดตอนโหลด · ชื่อผู้เข้าร่วม slide-in ตอนเด้งเข้า · KPI count-up
- footer มี credit "พัฒนาโดย Owl Day House" เล็ก ๆ (ธีมหลักเป็นของ มพ. ไม่ใช่ Owl gold/navy)

---

## 8. Seed Data (สร้างให้แน่น — นี่คือสิ่งที่ทำให้เดโม่น่าเชื่อ)

- **ข้อมูลปลอมล้วน** (กัน PDPA) แต่ต้อง "สมจริง"
- คณะ ~4: ICT / วิทยาศาสตร์ / บริหารธุรกิจและนิเทศฯ / พยาบาลศาสตร์
- นิสิต ~40–50: ชื่อไทยสมจริง, รหัสรูปแบบจริง (เช่น 65031234), กระจายคณะ/ชั้นปี, **จำนวนกิจกรรมต่อคนไม่เท่ากัน** (ให้เรดาร์แต่ละคนต่างกัน—บางคนรอบด้าน บางคนแหลม)
- กิจกรรม ~12–15 ที่ dims กระจายครบ 6 ด้าน (orientation, ค่ายอาสา, hackathon, UX workshop, ลอยกระทง, กีฬาสี, บริจาคโลหิต, สัมมนาวิชาการ, ค่ายภาษา, startup pitch, จิตอาสาสอนน้อง, cultural night, ไซเบอร์, วิ่งการกุศล, ปลูกป่า)
- การเข้าร่วม ~250–400 records ให้ dashboard/กราฟ/เรดาร์มีเนื้อ
- ต้องมีนิสิต "ตัวอย่างเด่น" 2–3 คนที่เรดาร์สวย/เล่าเรื่องได้ ไว้ใช้ตอนนำเสนอ

---

## 9. Build Order — เริ่มที่ M0 เสมอ

| M | ทำอะไร | เสร็จเมื่อ |
|---|---|---|
| **M0** | scaffold Vite+TS+router, นิยาม types + `Store`, ทำ `LocalStore`, **seed data แน่น** | เปิดแอปมามีข้อมูลทันที |
| **M1** | Organizer: list + create (สไลเดอร์ 6 ด้าน + มินิเรดาร์) + detail + QR | สร้างกิจกรรมได้ มี QR |
| **M2** | นิสิต scan/join → ชื่อเด้งเข้ารายชื่อ (LocalStore, ทดสอบ 2 แท็บ) | join แล้วเห็นในรายการ |
| **M3** | **Transcript เรดาร์ 6 แกน** + จุดเด่น/ควรเสริม + balance + รายการ | เรดาร์สวย เล่าเรื่องได้ |
| **M4** | Dashboard: KPI + กราฟ + ตารางนิสิต drill-down + under-served | dashboard มีเนื้อ |
| **M5** | polish: ธีม มพ., responsive, motion, ปุ่ม seed/reset, (optional) Character AI | ดูเป็นของจริง |
| **M6** | (ก่อน pitch) `ApiStore` + backend จิ๋ว → มือถือสแกนข้ามเครื่อง | wow ข้ามเครื่องได้ |

**ทำ M0 ให้ครบก่อนแตะ UI สวย** — จะได้ไม่หลงตกแต่งหน้าเปล่า ทุกหน้าต้องมีข้อมูลตั้งแต่แรก

---

## 10. Character AI (optional — feature เปิด/ปิดได้ อย่าให้บล็อกงานหลัก)

map top-2 ด้าน → **ฉายา/archetype + คำอธิบายสั้น** ปิดท้าย transcript
- **Default = template-based** (map top2 → ข้อความเขียนไว้ล่วงหน้า) → เร็ว, ไม่พึ่ง network, เดโม่นิ่ง
- **ตัวเลือก AI จริง:** เรียก Anthropic API ด้วย `ANTHROPIC_API_KEY` ส่งคะแนน 6 ด้าน → ขอ persona 2–3 ประโยค (**บังคับ output เป็น JSON, มี fallback เป็น template ถ้า API ล่ม**)
- ทำเป็น flag `VITE_PERSONA=template|ai`

---

## 11. Conventions & Guardrails

- โค้ด/คอมเมนต์: ไทยผสมอังกฤษได้ตามธรรมชาติ · ชื่อ type/ฟังก์ชันเป็นอังกฤษ
- โครงสร้างแนะนำ: `src/{store, types, seed, components, pages, lib}` · store impl แยกไฟล์ชัด
- UI เรียก `Store` เท่านั้น — ห้าม import localStorage/fetch ในหน้าจอ
- ตัวเลขเงิน/คะแนน format ให้อ่านง่าย · ตัวเลข/รหัสใช้ฟอนต์ mono
- **ข้อมูลปลอมล้วน** — ห้ามใส่ PII จริงของนิสิต (กฎ PDPA ของ ODH)
- เดโม่ต้อง **reset ได้ในคลิกเดียว** เผื่อซ้อม/นำเสนอหลายรอบ
- อย่า over-build เกิน scope §2 — พอให้เชื่อและตื่นเต้น ไม่ใช่ระบบจริงทั้งก้อน

---

## 12. Definition of Done (เดโม่พร้อมนำเสนอ)

- [ ] เปิดแอปมามีข้อมูลแน่นทุกหน้า (ไม่มีหน้าเปล่า)
- [ ] สร้างกิจกรรมสด + ตั้งสไลเดอร์ 6 ด้าน + เห็นมินิเรดาร์ + ได้ QR
- [ ] สแกน/กรอกโค้ด → เลือกตัวตน → ยืนยัน → ชื่อเด้งเข้ารายชื่อ (เห็นสด)
- [ ] Transcript เรดาร์ 6 แกนวาดสวย + บอกจุดเด่น/ควรเสริม + balance
- [ ] Dashboard KPI + กราฟ + ค้นหานิสิต + drill-down + under-served
- [ ] ธีม มพ. + ฟอนต์ + motion เบา + responsive มือถือ
- [ ] ปุ่ม seed/reset ใช้ได้
- [ ] (ถ้าเลือก) มือถือจริงสแกนข้ามเครื่องได้ (ApiStore + backend จิ๋ว)
- [ ] (optional) ฉายา Character AI แสดงผล

---

## 13. คำสั่งเริ่มงาน (พิมพ์ให้ Claude Code)

> "เริ่มที่ M0: scaffold โปรเจกต์ Vite + React + TS + React Router, นิยาม types และ `Store` interface ตาม CLAUDE.md, implement `LocalStore` ด้วย localStorage, แล้วสร้าง seed data ให้แน่นตาม §8 (คณะ 4, นิสิต ~45, กิจกรรม ~14, การเข้าร่วม ~300) — พร้อมปุ่ม seed/reset. เสร็จแล้วให้ผมรันดูก่อนไป M1"
