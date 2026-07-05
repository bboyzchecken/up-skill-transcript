# CLAUDE.md — ADDENDUM: BCA Identity Upgrade (Tier A)

> **อ่าน `SKILL_TRANSCRIPT_CLAUDE.md` (base) ก่อน แล้ว apply การเปลี่ยนแปลงในไฟล์นี้ทับ**
> ไฟล์นี้ = ส่วนที่ *เพิ่ม/แก้* หลังได้ framework จริงของลูกค้า (BCA Identity) · เริ่มที่ **U1**

---

## 1. สิ่งที่เปลี่ยนจาก base (สรุป)

- โมเดล competency: **6 → 7 โดเมน** (เพิ่ม `character`)
- เพิ่มระบบ **Identity ladder LV1–6** + auto-leveling
- เพิ่ม **taxonomy ย่อย** (โดเมน→กลุ่ม→โค้ด) สำหรับ sunburst/portfolio
- เพิ่ม outputs: เรดาร์ 7 แกน · เรดาร์ราย­สาขา · ตาราง Identity% จัดอันดับ · sunburst wheel (static) · **BCA Portfolio พิมพ์ได้**
- seed ใหม่ให้ reproduce เลขลูกค้า (434 คน / 8 สาขา)
- ทิ้ง feature "ฉายา Character AI" ใน base §10 (Character คือมิติ ไม่ใช่ AI) — ถ้าจะเก็บ persona ให้เป็น optional เล็ก ๆ ไม่ใช่งานหลัก

---

## 2. แก้ Data Model

```ts
// เพิ่ม character → Dims เป็น 7 โดเมน
type Dims = { knowledge:number; skill:number; attitude:number; character:number;
              aesthetics:number; ethics:number; wellness:number } // 0–10 ต่อด้าน

// Taxonomy (สำหรับ sunburst/portfolio)
type SubCompetency = { code:string; label?:string }              // เช่น KE1
type SubGroup      = { prefix:string; label:string; items:SubCompetency[] } // เช่น KE
type Domain        = { key:keyof Dims; label:string; labelEn:string;
                       color:string; groups:SubGroup[] }

// Activity: เพิ่ม identityLevel (+ subCodes optional สำหรับ Tier B)
Activity = { …base…, dims:Dims,
             identityLevel: 1|2|3|4|5|6|null,   // null = co-curricular ไม่ปลดระดับ
             subCodes?: string[] }              // Tier B เท่านั้น

// Student: เพิ่มสาขาโค้ด
Student = { …base…, majorCode:'ComM'|'ECON'|'F&I'|'ACC'|'BMG'|'DMKT'|'NMC'|'TR&H' }

// Transcript: เพิ่ม identity
Transcript = { studentId, totals:Dims, top2:string[], bottom2:string[],
               balanceScore:number, activities:Participation[],
               identityLevel:number, identityScore:number }  // 0–100
```

**Store เพิ่ม method:**
```ts
getDomains(): Promise<Domain[]>                        // taxonomy tree
majorRadar(majorCode: string): Promise<Dims>           // เรดาร์เฉลี่ยราย­สาขา
identityRanking(): Promise<{ majorCode:string; name:string; n:number; identityPct:number }[]>
```

---

## 3. Compute layer (Tier A)

```ts
// auto-leveling: ระดับ = สูงสุดของกิจกรรม completed (บันไดสะสม)
identityLevel = max( completed activities' identityLevel ?? 0 )   // 0 = ยังไม่เข้าเส้น

// Identity% ของนิสิต (placeholder — คำนวณคร่าว ๆ ตามที่ตกลง)
domainsCovered = จำนวนโดเมนใน totals ที่ > 0   // 0..7
studentIdentityPct = round( 100 × ( 0.5×(identityLevel/6) + 0.5×(domainsCovered/7) ) )

// Identity% ของสาขา = เฉลี่ย studentIdentityPct ของนิสิตในสาขา
```
> แยกสูตรไว้ไฟล์เดียว (`lib/identity.ts`) ให้เปลี่ยนง่าย — ลูกค้าจะให้สูตรจริงทีหลัง

---

## 4. Seed upgrade (สำคัญ — ต้อง reproduce เลขลูกค้า)

**8 สาขา + เป้า (ปรับ participation ให้ Identity% เฉลี่ยออกใกล้ค่านี้):**

| majorCode | สาขา | n | เป้า Identity% |
|---|---|---|---|
| ComM | การจัดการการสื่อสาร | 46 | 94 |
| ECON | เศรษฐศาสตร์ | 21 | 93 |
| F&I | การเงินและการลงทุน | 94 | 83 |
| ACC | การบัญชี | 29 | 82 |
| BMG | การจัดการธุรกิจ | 61 | 81 |
| DMKT | การตลาดดิจิทัล | 48 | 80 |
| NMC | การสื่อสารสื่อใหม่ | 92 | 63 |
| TR&H | การท่องเที่ยวและโรงแรม | 43 | 59 |

- สร้างนิสิต **lightweight ~434** ตาม n → จูน participation ต่อสาขาให้เฉลี่ยเข้าเป้า (ยอมคลาด ±2)
- ทับด้วยนิสิต **rich ~10–15** (participation เต็ม, มีทั้งเรดาร์รอบด้าน+แหลม) ไว้ทำ portfolio/drill-down
- **กิจกรรม BCA จริง + identityLevel:**
  - LV1 Inspiration Talk · LV2 BCA Stock Trading / โชว์ของหน้าตึก / BCA Content Creator · LV3 BCA Young Entrepreneur Challenge · LV4 BCA Business Showcase · LV5 BCA Startup Incubation · LV6 BCA Business Expansion
  - + co-curricular ทั่วไป (`identityLevel:null`) ให้คะแนน 7 โดเมนกระจาย
- **Taxonomy seed** (ประมาณจาก PDF — mark ให้ยืนยัน):
  - K: KE1-4, KC1-3, KR1-4, KT1-3 · S: SA1-3, SC1-3, SD1-3, SE1-3, SL1-4 · A: AD1-3, AC1-3, AE1-3
  - C: CT1-2, CP1-3, CR1-3, CW1-3 · Aesthetics: AEC1-2, AEL1-3 · Ethics: E1-3 · Wellness: W1-5

---

## 5. สี 7 โดเมน (แทน palette 6 สีใน base)

```
knowledge  #1F5C8B   skill    #E67E22   attitude   #27AE60   character #29ABE2
aesthetics #C0399B   ethics   #6C5CE7   wellness   #16A085
```
5 สีแรกให้ตรง sunburst PDF · ใช้คงเส้นคงวาในเรดาร์/wheel/แท็ก/ladder

---

## 6. UI ที่ต้องเพิ่ม-อัปเกรด

- **เรดาร์ → 7 แกน** ทุกที่ (transcript, portfolio, สาขา) · props เปิด/ปิดแกนได้
- **Identity ladder** component: บันได LV1–6 แนวตั้ง/ขั้นบันได ไฮไลต์ระดับปัจจุบัน + tooltip กิจกรรมที่ปลดแต่ละขั้น · แยกโซน Intra (1–3) / Entre (4–6)
- **หน้า Dashboard เพิ่ม:**
  - เลือกสาขา → **เรดาร์เฉลี่ย 7 แกน** (หัวข้อชื่อสาขา แบบสไลด์ COMMUNICATION MANAGEMENT)
  - **ตาราง Identity% จัดอันดับ** 8 สาขา + n (แบบสไลด์ "ผลการวิเคราะห์ข้อมูล")
  - การกระจายระดับ Identity (LV1–6) ต่อสาขา
- **Sunburst competency wheel** (static): 7 โดเมน→กลุ่ม→โค้ด · สีตาม §5 · Recharts ไม่มี sunburst → ใช้ **d3 hierarchy/partition** หรือ hand-roll SVG arcs · วางบนหน้า analytics + ย่อบน portfolio
- **BCA Portfolio / Skill Transcript (พิมพ์ได้):** หน้า A4 print-friendly — หัวนิสิต (ชื่อ/รหัส/สาขา) + เรดาร์ 7 แกน + **ระดับ Identity + บันได** + จุดเด่น competency (top โดเมน/โค้ด) + รายการกิจกรรม → `@media print` ให้ออก PDF สะอาด (อ้าง pattern จาก `owl-docs-generator.html`)

---

## 7. Build Order (Upgrade)

| U | ทำ | เสร็จเมื่อ |
|---|---|---|
| **U1** | แก้ Dims→7, เพิ่ม taxonomy/identity types + Store methods, compute (auto-level + Identity%), **seed ให้ตรงเลขลูกค้า** | เปิดมา `identityRanking()` ออกใกล้ตาราง §4 |
| **U2** | เรดาร์ 7 แกน + Identity ladder | โชว์ระดับ+บันไดได้ |
| **U3** | BCA Portfolio พิมพ์ได้ (print CSS) | print → PDF สวย |
| **U4** | Dashboard: เรดาร์สาขา + ตารางจัดอันดับ + การกระจายระดับ | ตรงสไลด์ลูกค้า |
| **U5** | Sunburst wheel (static, d3/SVG) | wheel สวย |
| **U6** | polish + toggle แกน + เก็บงาน | พร้อมนำเสนอ |

**เริ่ม U1 ให้จบก่อนแตะ UI** — downstream พึ่ง seed+compute ชุดนี้

---

## 8. Guardrails เพิ่ม

- โค้ด competency + Identity% = **ประมาณ/placeholder** จาก PDF → คอมเมนต์ `// TODO: confirm with client` ตรงจุดที่ hardcode
- Sunburst/subCodes = **static ใน Tier A** · อย่าเพิ่งทำ tagging เต็มหรือ coverage สด (นั่น Tier B)
- ยังเป็นเดโม่: ไม่ต่อ SSO/ทะเบียนจริง · ข้อมูลปลอมล้วน · reset ได้คลิกเดียว
- อย่า over-build เกิน Tier A

---

## 9. คำสั่งเริ่มงาน (พิมพ์ให้ Claude Code)

> "เริ่ม U1 ตาม CLAUDE ADDENDUM: แก้ `Dims` เป็น 7 โดเมน (เพิ่ม character), เพิ่ม types taxonomy + identity + Store methods (`getDomains`, `majorRadar`, `identityRanking`), ทำ compute layer `lib/identity.ts` (auto-leveling + Identity% ตามสูตร placeholder), แล้ว seed ใหม่ให้ `identityRanking()` ออกใกล้ตาราง 8 สาขา/434 คน — ใส่กิจกรรม BCA จริงพร้อม identityLevel + taxonomy รหัสจาก PDF + rich students ~12 คน. เสร็จให้ผมรันเช็ค aggregate ก่อนไป U2"
