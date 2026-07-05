# Skill Transcript — เดโม่ (Owl Day House × ม.พะเยา คณะ BCA)

ระบบจำลอง **"ทรานสคริปต์ทักษะ + BCA Identity"** — นิสิตเข้าร่วมกิจกรรมคณะ → แต่ละกิจกรรมให้คะแนน
**7 โดเมน** (ความรู้ / ทักษะ / ทัศนคติ / **อุปนิสัย** / สุนทรียภาพ / จริยธรรม / สุขภาวะ) และ
**ปลดระดับ BCA Identity (บันได LV1–6)** อัตโนมัติ → สรุปเป็น **เรดาร์ใยแมงมุม 7 แกน**,
**บันไดผู้ประกอบการ**, **Portfolio พิมพ์ได้**, และ dashboard **Identity% ราย­สาขา** ที่ reproduce
การวิเคราะห์มือของลูกค้าได้ (8 สาขา / 434 คน)

> เดโม่เพื่อการนำเสนอปิดการขาย — ไม่ใช่ระบบ production · ข้อมูลตัวอย่างทั้งหมด (กัน PDPA)
> อัปเกรด **BCA Identity (Tier A)** ทับ base — ดู `SKILL_TRANSCRIPT_CLAUDE_ADDENDUM.md`

## สโคปตามที่ตัดสินใจ

- **BCA Identity** = บันได 6 ระดับ (LV1–3 Intrapreneurship · LV4–6 Entrepreneurship) ผูกกิจกรรมจริง
  ปลดระดับอัตโนมัติ = สูงสุดของกิจกรรมสาย Identity ที่ทำ (co-curricular = ไม่ปลดระดับ)
- **7 โดเมน + taxonomy ย่อย** (โดเมน→กลุ่ม→โค้ด เช่น KE1/SC2) โชว์เป็น **sunburst wheel**
- **Identity%** = สูตร placeholder (`lib/identity.ts`) ผสมระดับบันได + ความครบของ competency
- **"Character/อุปนิสัย" คือมิติ competency ที่ 7** (ไม่ใช่ Character AI) · persona template เก็บเป็น optional
- **สี** = สีทางการ ม.พะเยา (ม่วง–ทอง) เป็น brand หลัก · 7 สีประจำโดเมน (5 แรกตรง sunburst PDF ลูกค้า)
- **เดโม่จอเดียว** — เรียลไทม์ข้ามแท็บด้วย `storage` event · **โฟกัสคณะเดียว** = BCA

## การรัน

> ⚠️ ต้องใช้ **Node ≥ 18** (โปรเจกต์นี้พัฒนาบน Node 22) — `node` เริ่มต้นบางเครื่องเป็น v12 ซึ่งรัน Vite ไม่ได้
> ถ้าใช้ nvm: `nvm use 22`

```bash
npm install
npm run dev      # เปิด http://localhost:5173
npm run build    # typecheck + build production ลง dist/
```

## Deploy — static ล้วน 0 บาท

เว็บเป็น **static ทั้งหมด** (ไม่ต้อง runtime/DB) และใช้ **HashRouter** — route อยู่หลัง `#`
จึงวางในโฟลเดอร์/โดเมน/subpath ไหนก็รันได้ทันที **โดยไม่ต้องตั้ง rewrite rule ที่เซิร์ฟเวอร์**
(deep link/QR เช่น `.../#/join/CODE` รีเฟรชได้ไม่ 404)

### เป้าหมาย: `owldayhouse.com/up-skill-transcript`

```bash
npm run build:owl     # = VITE_BASE=/up-skill-transcript/ vite build
```

แล้วอัปโหลด **ทั้งโฟลเดอร์ `dist/`** (index.html + assets/ + favicon.svg) ไปวางใต้ path
`/up-skill-transcript/` ของโฮสต์ — จบ (asset ถูก prefix `/up-skill-transcript/` ให้แล้ว)
⚠️ base ต้อง **ตรงกับชื่อโฟลเดอร์บนเซิร์ฟเวอร์เป๊ะ ๆ** ไม่งั้น asset จะ 404 = จอขาว ·
ถ้าย้าย subpath อื่น build ใหม่ด้วย `VITE_BASE=/ชื่อโฟลเดอร์/ vite build`

- เสิร์ฟที่ **root** (custom domain ตรง ๆ / Cloudflare `*.pages.dev`): `npm run build` เฉย ๆ (base `/`)
- **GitHub Pages** (ทางเลือกฟรี auto-deploy): [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)
  build แล้ว push `dist/` ขึ้น branch **`gh-pages`** อัตโนมัติทุกครั้งที่ push `main` (ตั้ง base = `/<repo>/` ให้แล้ว)
  · ครั้งแรกให้ตั้ง **Settings → Pages → Source = "Deploy from a branch" → `gh-pages` / `root`** ครั้งเดียว
  (ใช้วิธี branch แทน Pages API เพราะ `GITHUB_TOKEN` ของ Actions สร้าง Pages site เองไม่ได้ในบางรีโป)

## Flow เดโม่ (สคริปต์ 5 นาที)

1. **เจ้าหน้าที่** — `/staff` → สร้างกิจกรรม ตั้งสไลเดอร์ 7 โดเมน + เลือกระดับ Identity เห็นมินิเรดาร์สด → QR + join code
2. **นิสิตเข้าร่วม** — เปิดหน้ากิจกรรม กดปุ่ม *"เปิดหน้าเข้าร่วม (อีกแท็บ)"* → เลือกตัวตน → ยืนยัน →
   ชื่อเด้งเข้ารายชื่อฝั่งเจ้าหน้าที่แบบเรียลไทม์
3. **ทรานสคริปต์** — `/me` → เลือกนิสิตเด่น → เรดาร์ 7 แกน (เปิด/ปิดแกนได้) + ระดับ Identity + บันได + จุดเด่น →
   ปุ่ม *"พิมพ์ BCA Portfolio"* → หน้า A4 print-friendly (บันทึกเป็น PDF)
4. **กองกิจการนิสิต** — `/dashboard` → KPI/กราฟ · แท็บ **BCA Identity** = ตาราง Identity% จัดอันดับ 8 สาขา +
   เรดาร์เฉลี่ยราย­สาขา + การกระจายระดับ + **sunburst competency wheel**

ปุ่ม **รีเซ็ตข้อมูลเดโม่** อยู่ที่ footer (โหลดข้อมูลตัวอย่างใหม่ในคลิกเดียว เผื่อซ้อมหลายรอบ)

## โครงสร้าง

```
src/
  types.ts            type กลาง (Dims 7 โดเมน, Identity, Taxonomy, Activity, Student, ...)
  theme.ts            สี มพ. + metadata 7 โดเมน (สี/ป้าย/ไอคอน)
  store/
    Store.ts          interface กลาง (+ getDomains / majorRadar / identityRanking)
    LocalStore.ts     impl บน localStorage + sync ข้ามแท็บ
    views.ts          pure derivations (transcript / dashboard / major radar / identity ranking)
    index.ts          singleton + hook useLive (reactive, sync)
  seed/               seed สมจริง — 8 สาขา/434 คน (reproduce เลขลูกค้า), กิจกรรม BCA + identityLevel, rich ~12
  lib/                compute (เรดาร์/balance), identity (auto-level + Identity%), taxonomy (7 โดเมน + บันได), persona
  components/         Radar (7 แกน, toggle), IdentityLadder, IdentityBadge, SunburstWheel, Charts, ...
  pages/              Home · staff · join · me (+ portfolio พิมพ์ได้) · dashboard (+ แท็บ BCA Identity)
scripts/tune-seed.ts  คาลิเบรต strength ราย­สาขา ให้ identityRanking() เข้าเป้า (±2)
```

UI เรียกผ่าน `Store` เท่านั้น — ไม่แตะ localStorage/fetch ตรง ๆ (สลับ backend ได้โดยไม่แก้หน้าจอ)

---
พัฒนาโดย **Owl Day House** · ธีมหลักเป็นของมหาวิทยาลัยพะเยา
