# SKILL TRANSCRIPT — แพลนส่วนต่อขยาย (BCA Identity / Tier A)

> **อ่านคู่กับ `SKILL_TRANSCRIPT_PLAN.md` (ของเดิม ไม่แก้)** — ไฟล์นี้คือส่วนที่ *เพิ่ม/แก้* หลังได้ PDF ลูกค้า (BCA มธ. / คณะบริหารธุรกิจฯ)
> Tier A = ทำให้ "ดูเป็นระบบของเขาครบทุกภาพ" โดยไม่ build ทุกอย่าง

---

## 0. แก้ความเข้าใจ + 3 ข้อตัดสิน (ยืนยันแล้ว)

- ❗ **"Character" ไม่ใช่ "Character AI"** — มันคือ **มิติ competency ที่ 7** (มีลูกย่อย CT/CP/CR/CW) → ผมเดาผิดตอนแรก ทิ้ง feature "ฉายา AI" ไปได้ (จะเก็บเป็น optional เล็ก ๆ ทีหลังก็ได้ ไม่ใช่ประเด็นหลัก)
- ✅ **เรดาร์ = 7 แกนครบ:** Knowledge · Skill · Attitude · Character · Ethics · Aesthetics · Wellness
- ✅ **Identity% = คำนวณคร่าว ๆ ก่อน** (สูตร placeholder §6 — เปลี่ยนทีหลังได้)
- ✅ **นิสิตขึ้นระดับ Identity อัตโนมัติ** จากกิจกรรมที่เข้าร่วม (ไม่ต้องมีอาจารย์อนุมัติในเดโม่)

**จุดขายที่คมขึ้นจาก PDF:** ลูกค้า *ทำ analysis พวกนี้ด้วยมือ/Excel อยู่แล้ว* (มีเลขจริง 434 คน, Identity% ต่อสาขา, sunburst, เรดาร์) — pain คือ **มันไม่ auto ไม่มีระบบเก็บ participation** → เดโม่เราขาย "ของที่คุณทำมือ กลายเป็นระบบสดที่ auto-generate จากการสแกน" **ไม่ใช่แค่เรดาร์สวย**

---

## 1. Framework ลูกค้า 3 ชั้น (สรุปให้ไฟล์นี้อ่านจบในตัว)

1. **BCA Identity = บันได 6 ระดับ** (เอกลักษณ์ "ผู้ประกอบการ + นักสื่อสาร")
   - LV1–3 = **Intrapreneurship**, LV4–6 = **Entrepreneurship**
   - แต่ละ LV ผูกกิจกรรมจริง (Inspiration Talk, Stock Trading, Young Entrepreneur Challenge …)
2. **Competency 7 โดเมน + taxonomy ย่อย** — แต่ละโดเมนมีกลุ่มย่อยรหัส 2 ตัว → รายการย่อย (KE1, SC2, AD3…) · กิจกรรม map ไปที่โค้ดย่อย
3. **Outputs หลายชั้น:** เรดาร์รายคน → เรดาร์ราย­สาขา → sunburst taxonomy → ตาราง Identity% จัดอันดับต่อสาขา → **BCA Portfolio / Skill Transcript** พิมพ์ได้

---

## 2. Tier A ทำอะไรเพิ่ม vs เก็บเป็น Tier B

**Tier A (ทำในเดโม่นี้)**
- เพิ่ม **Character** → เรดาร์/โมเดลเป็น **7 โดเมน**
- **บันได Identity LV1–6** + auto-leveling + โชว์ระดับนิสิต + การกระจายระดับต่อสาขา
- **เรดาร์ราย­สาขา** (aggregate) + **ตาราง Identity% จัดอันดับ** (reproduce เลขลูกค้า)
- **BCA Portfolio / Skill Transcript พิมพ์ได้** (upgrade จากหน้า transcript เดิม)
- **Sunburst competency wheel** = seed **static** (สวย ไม่ผูก live) → ได้ wow งานน้อย
- seed **taxonomy รหัสย่อย** จาก PDF (โชว์ใน 하wheel/portfolio) แต่ **create-activity ยังใช้สไลเดอร์ระดับโดเมน** (ไม่ต้อง tag ทุกโค้ดย่อย)

**Tier B (พูดปากเปล่าว่า "ต่อได้ในเฟส production")**
- create-activity แบบ **tag sub-competency เต็ม** (checkbox tree KE1/SC2/…)
- **sunburst สะท้อน coverage สด** จาก participation จริง
- สูตร Identity% จริง + prerequisite ของบันได + อาจารย์อนุมัติระดับ

---

## 3. 7 โดเมน (สี + prefix รหัส)

| # | โดเมน | ไทย | สี (5 แรก match PDF) | prefix รหัสย่อย |
|---|---|---|---|---|
| 1 | Knowledge | ความรู้ | `#1F5C8B` น้ำเงินเข้ม | KE · KC · KR · KT |
| 2 | Skill | ทักษะ | `#E67E22` ส้ม | SA · SC · SD · SE · SL |
| 3 | Attitude | ทัศนคติ | `#27AE60` เขียว | AD · AC · AE |
| 4 | Character | อุปนิสัย | `#29ABE2` ฟ้า | CT · CP · CR · CW |
| 5 | Aesthetics | สุนทรียภาพ | `#C0399B` ม่วงแดง | AEC · AEL |
| 6 | Ethics | จริยธรรม | `#6C5CE7` คราม | E (E1…) |
| 7 | Wellness | สุขภาวะ | `#16A085` เขียวน้ำทะเล | W (W1…) |

> 5 สีแรกตั้งให้ตรง sunburst ใน PDF · Ethics/Wellness เพิ่มเข้ามา (ใน PDF มีโค้ดน้อย) — สีทั้งชุดใช้คงเส้นคงวาในเรดาร์/wheel/แท็ก

---

## 4. Taxonomy seed (ดึงจาก PDF — *ให้ยืนยันโค้ดจริงกับลูกค้า*)

โครงสร้าง: **โดเมน → กลุ่มย่อย(prefix) → โค้ด** (ใส่เท่าที่เห็นใน PDF + เติมให้ครบทรงพอเดโม่)

```
Knowledge  KE (Entrepreneurship) KE1-4 · KC (Communication) KC1-3
           KR (Research) KR1-4 · KT (Technology) KT1-3
Skill      SA (Analysis) SA1-3 · SC (Communication) SC1-3 · SD (Digital) SD1-3
           SE (English) SE1-3 · SL (Leadership) SL1-4
Attitude   AD (Dare) AD1-3 · AC (Creativity) AC1-3 · AE (Entrepreneurship) AE1-3
Character  CT (Time Mgmt) CT1-2 · CP (Personality) CP1-3 · CR (Resilience) CR1-3 · CW (Will) CW1-3
Aesthetics AEC (Creativity) AEC1-2 · AEL (Lifestyle) AEL1-3
Ethics     E1-3        (โค้ดใน PDF น้อย — placeholder ให้ยืนยัน)
Wellness   W1-5        (เห็น W3,W5 ใน PDF — เติมให้ครบ)
```

> ⚠️ โค้ดพวกนี้ **ประมาณจาก PDF** — ก่อนใช้จริงต้องขอ master list จากลูกค้า ในเดโม่ใช้ชุดนี้พอให้ wheel/portfolio ดูสมจริง

---

## 5. บันได Identity LV1–6 + auto-leveling

| LV | กลุ่ม | ความหมาย | กิจกรรมที่ปลดล็อก (จาก PDF) |
|---|---|---|---|
| 1 | Intra | มี Mindset ผู้ประกอบการ+นักสื่อสาร | Inspiration Talk |
| 2 | Intra | ใช้เครื่องมือธุรกิจ+สื่อสารได้ | Stock Trading · โชว์ของหน้าตึก · BCA Content Creator |
| 3 | Intra | ออกแบบแผนธุรกิจ+แผนสื่อสารได้ | BCA Young Entrepreneur Challenge |
| 4 | Entre | ทำได้ ขายได้ | แสดงหลักฐานการทำธุรกิจ (Business Showcase) |
| 5 | Entre | +ไปได้ (BMC ครบ/ที่ปรึกษา/แยกบัญชี) | Startup Incubation |
| 6 | Entre | +โตได้ (ขยาย/จดทะเบียน) | Business Expansion |

**Auto-leveling (Tier A):** `student.identityLevel = max(identityLevel ของกิจกรรมที่ completed)` (ถือว่าบันไดสะสม)
- กิจกรรม **co-curricular ทั่วไป** (ปฐมนิเทศ/อาสา/กีฬาสี ฯลฯ) มี `identityLevel = null` → ให้คะแนน competency แต่ **ไม่ปลดระดับ Identity**
- *(Tier B: บังคับปลดตามลำดับ LV1→LV6 + อาจารย์ยืนยัน)*

---

## 6. Identity% — สูตรคร่าว ๆ (placeholder)

**คะแนน Identity ของนิสิต (0–100)** = ผสมระดับบันได + ความครบของ competency
```
studentIdentity% = round( 100 × ( 0.5 × (identityLevel / 6)
                                 + 0.5 × (จำนวนโดเมนที่มีคะแนน / 7) ) )
```
**Identity% ของสาขา** = ค่าเฉลี่ย studentIdentity% ของนิสิตในสาขานั้น

> "คร่าว ๆ" ตามที่ตกลง — เปลี่ยนสูตรได้ในจุดเดียว · เดโม่ตั้งเป้าให้ผลลัพธ์ต่อสาขา *ใกล้เลขลูกค้า* (§8) เพื่อโชว์ว่า "ระบบ reproduce การวิเคราะห์ของคุณได้"

---

## 7. Outputs / หน้าจอที่เพิ่ม-อัปเกรด

| หน้า | สถานะ | รายละเอียด |
|---|---|---|
| เรดาร์ (ทุกที่) | **อัปเกรด → 7 แกน** | เพิ่ม Character · เปิด/ปิดแกนได้ |
| **Identity ladder** | **ใหม่** | บันได LV1–6 ไฮไลต์ระดับปัจจุบัน + กิจกรรมที่ปลดแต่ละขั้น (บน portfolio + cohort บน dashboard) |
| **เรดาร์ราย­สาขา** | **ใหม่** | เลือกสาขา → เรดาร์เฉลี่ย 7 แกน (เลียนสไลด์ COMMUNICATION MANAGEMENT) |
| **ตาราง Identity% จัดอันดับ** | **ใหม่** | สาขาเรียงตาม Identity% + n (เลียนสไลด์ "ผลการวิเคราะห์ข้อมูล") |
| **Sunburst wheel** | **ใหม่ (static)** | taxonomy 7 โดเมนเป็น sunburst สีตาม PDF |
| **BCA Portfolio / Skill Transcript** | **อัปเกรดจาก transcript เดิม** | หน้าพิมพ์ได้: หัวนิสิต + เรดาร์ + ระดับ Identity/บันได + จุดเด่น competency + รายการกิจกรรม → **print → PDF** (ใช้ pattern @media print แบบเดียวกับ `owl-docs-generator.html`) |

---

## 8. Seed upgrade (reproduce เลขลูกค้าให้ตรง — นี่คือหมัดเด็ด)

**8 สาขาจริง + เลขจาก PDF** (ตั้งเป้าให้ dashboard ออกใกล้ค่านี้):

| อันดับ | สาขา (โค้ด) | n | Identity% |
|---|---|---|---|
| 1 | การจัดการการสื่อสาร (ComM) | 46 | 94% |
| 2 | เศรษฐศาสตร์ (ECON) | 21 | 93% |
| 3 | การเงินและการลงทุน (F&I) | 94 | 83% |
| 4 | การบัญชี (ACC) | 29 | 82% |
| 5 | การจัดการธุรกิจ (BMG) | 61 | 81% |
| 6 | การตลาดดิจิทัล (DMKT) | 48 | 80% |
| 7 | การสื่อสารสื่อใหม่ (NMC) | 92 | 63% |
| 8 | การท่องเที่ยวและโรงแรม (TR&H) | 43 | 59% |
| | **รวม** | **434** | |

**วิธี seed:**
- สร้าง **นิสิต lightweight ~434 คน** (แค่ field ที่พอคำนวณ aggregate) กระจาย 8 สาขาตาม n ข้างบน + ปรับ participation ให้ Identity% เฉลี่ยออกใกล้เป้า
- ทับด้วย **นิสิต "rich" ~10–15 คน** ที่มี participation เต็ม ไว้ drill-down + ทำ portfolio จริง (มีทั้งคนเรดาร์รอบด้าน และคนแหลม)
- กิจกรรม: ใส่ **ชื่อ BCA จริง** (§5) + `identityLevel` + คะแนน 7 โดเมน · เสริมกิจกรรม co-curricular ทั่วไป (`identityLevel=null`)
- ข้อมูลปลอมล้วน (PDPA)

---

## 9. Upgrade Milestones (ต่อจาก M-plan เดิม)

| U | ทำอะไร | เสร็จเมื่อ |
|---|---|---|
| **U1** | โมเดล+seed: 7 โดเมน (เพิ่ม Character), taxonomy tree, กิจกรรม BCA+identityLevel, 8 สาขา+เลขลูกค้า, rich students · ต่อ compute: auto-leveling + Identity% | เปิดมา aggregate ใกล้เลข PDF |
| **U2** | เรดาร์ → 7 แกนทุกที่ + Identity ladder component | เรดาร์+บันไดโชว์ได้ |
| **U3** | BCA Portfolio / Skill Transcript พิมพ์ได้ (print CSS) | print → PDF สวย |
| **U4** | Dashboard: เรดาร์ราย­สาขา + ตาราง Identity% จัดอันดับ | ตรงสไลด์ลูกค้า |
| **U5** | Sunburst competency wheel (static, สีตาม PDF) | wheel สวย |
| **U6** | polish + เปิด/ปิดแกน + เก็บงาน | พร้อมนำเสนอ |

> ทำ **U1 ให้จบก่อน** — ทุกอย่าง downstream พึ่ง seed+compute ชุดนี้

---

## 10. ต้องคอนเฟิร์มกับลูกค้า + roadmap Tier B

**คอนเฟิร์ม:**
1. **Master list โค้ด competency** (ยืนยัน KE1…W5 ให้ครบ/ถูก)
2. **สูตร Identity% จริง** (ตอนนี้ใช้ placeholder §6)
3. กิจกรรม LV4–6 ชื่อทางการที่เขาใช้จริง (ผมตั้งชื่อ Showcase/Incubation/Expansion ไว้ก่อน)

**Tier B (เฟส production ที่ขายต่อได้):** sub-competency tagging เต็ม · sunburst live · สูตร Identity จริง + prerequisite บันได + อาจารย์อนุมัติ · **ต่อระบบทะเบียนกลาง/SSO จริง** (จุดที่ ODH ได้เปรียบ—เคยทำระบบมหาลัยมาก่อน)

---

## 11. ต่อจากนี้
- ไฟล์ `SKILL_TRANSCRIPT_CLAUDE_ADDENDUM.md` = spec ส่วนเพิ่มสำหรับ Claude Code (วางคู่ `CLAUDE.md` เดิมใน repo)
- สั่ง Claude Code เริ่มที่ **U1** (อัป schema + seed ให้ตรงเลขลูกค้า) แล้วไล่ U2→U6
