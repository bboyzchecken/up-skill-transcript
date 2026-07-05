# Skill Transcript — เดโม่ (Owl Day House × ม.พะเยา คณะ BCA)

ระบบจำลอง **"ทรานสคริปต์ทักษะ"** — นิสิตเข้าร่วมกิจกรรมคณะ → แต่ละกิจกรรมให้คะแนน
**6 ด้าน** (ความรู้ / ทักษะ / ทัศนคติ / คุณธรรม / สุนทรียภาพ / สุขภาวะ) → สรุปเป็น
**เรดาร์ใยแมงมุม 6 แกน** ที่บอกว่านิสิตคนนี้เด่นด้านไหน และคณะควรจัดกิจกรรมด้านใดเพิ่ม

> เดโม่เพื่อการนำเสนอปิดการขาย — ไม่ใช่ระบบ production · ข้อมูลตัวอย่างทั้งหมด (กัน PDPA)

## สโคปตามที่ตัดสินใจ (§13)

- **Character AI** = แบบ Template (personality-test style) — map top-2 ด้าน → ฉายา + คำบรรยาย (ไม่พึ่ง API)
- **สี** = สีทางการ ม.พะเยา (ม่วง–ทอง) เป็น brand หลัก · 6 สีประจำด้านใช้แยกแกนเรดาร์/กราฟ
- **เดโม่จอเดียว** — ไม่ต้องใช้มือถือจริง · เรียลไทม์ข้ามแท็บด้วย `storage` event (ตัด backend M6 ทิ้ง)
- **โฟกัสคณะเดียว** = คณะบริหารธุรกิจและนิเทศศาสตร์ (BCA) · analytics แบ่งตามสาขา/ชั้นปี

## การรัน

> ⚠️ ต้องใช้ **Node ≥ 18** (โปรเจกต์นี้พัฒนาบน Node 22) — `node` เริ่มต้นบางเครื่องเป็น v12 ซึ่งรัน Vite ไม่ได้
> ถ้าใช้ nvm: `nvm use 22`

```bash
npm install
npm run dev      # เปิด http://localhost:5173
npm run build    # typecheck + build production ลง dist/
```

## Deploy ฟรี 0 บาท (GitHub Pages)

มี GitHub Actions ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)) build เป็น static แล้ว deploy
อัตโนมัติทุกครั้งที่ push `main` → เว็บอยู่ที่ **https://bboyzchecken.github.io/up-skill-transcript/**

ตั้งครั้งเดียว: ไปที่ **repo → Settings → Pages → Build and deployment → Source = "GitHub Actions"**
(หลังจากนั้น push แต่ละครั้งจะ deploy ให้เอง · ต้นทุน 0 บาท)

- `base` ตั้งอัตโนมัติเป็น `/up-skill-transcript/` ตอน build บน CI (ผ่าน env `VITE_BASE`) — QR/ลิงก์ deep link
  (`/join/CODE`) ทำงานถูกต้องผ่าน `404.html` fallback
- โฮสต์อื่นที่ serve ที่ root (Cloudflare Pages `*.pages.dev`, Netlify) ก็ใช้ได้ — มี `public/_redirects` ให้แล้ว
  ตั้ง build command `npm run build`, output `dist`

## Flow เดโม่ (สคริปต์ 5 นาที)

1. **เจ้าหน้าที่** — `/staff` → สร้างกิจกรรม ตั้งสไลเดอร์ 6 ด้าน เห็นมินิเรดาร์สด → ได้ QR + join code
2. **นิสิตเข้าร่วม** — เปิดหน้ากิจกรรม กดปุ่ม *"เปิดหน้าเข้าร่วม (อีกแท็บ)"* → เลือกตัวตน → ยืนยัน →
   ชื่อเด้งเข้ารายชื่อฝั่งเจ้าหน้าที่แบบเรียลไทม์
3. **ทรานสคริปต์** — `/me` → เลือกนิสิตตัวอย่างเด่น → เรดาร์ 6 แกน + ฉายา + จุดเด่น/ควรเสริม + สมดุล
4. **กองกิจการนิสิต** — `/dashboard` → KPI, กราฟ, ตารางนิสิต, และแท็บ *วิเคราะห์* บอกด้านที่คณะ "จัดน้อย"

ปุ่ม **รีเซ็ตข้อมูลเดโม่** อยู่ที่ footer (โหลดข้อมูลตัวอย่างใหม่ในคลิกเดียว เผื่อซ้อมหลายรอบ)

## โครงสร้าง

```
src/
  types.ts            นิยาม type กลาง (Dims 6 ด้าน, Activity, Student, ...)
  theme.ts            สี มพ. + metadata 6 ด้าน (สี/ป้าย/ไอคอน)
  store/
    Store.ts          interface กลาง (สลับ LocalStore ↔ ApiStore ได้)
    LocalStore.ts     impl บน localStorage + sync ข้ามแท็บ
    views.ts          pure derivations (transcript / dashboard)
    index.ts          singleton + hook useLive (reactive, sync)
  seed/               seed data สมจริง (คณะ BCA, ~48 นิสิต, 15 กิจกรรม, ~280 การเข้าร่วม)
  lib/                compute (เรดาร์/balance), persona (Character template), format
  components/         Radar (SVG hand-rolled), Charts, DimSlider, QRCode, ...
  pages/              Home · staff · join · me · dashboard
```

UI เรียกผ่าน `Store` เท่านั้น — ไม่แตะ localStorage/fetch ตรง ๆ (สลับ backend ได้โดยไม่แก้หน้าจอ)

---
พัฒนาโดย **Owl Day House** · ธีมหลักเป็นของมหาวิทยาลัยพะเยา
