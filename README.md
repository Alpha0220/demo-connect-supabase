## Demo Supabase Connect

โปรเจกต์ตัวอย่าง Next.js + TypeScript + Tailwind สำหรับจัดการข้อมูลพนักงานโดยเชื่อมต่อกับ Supabase (Postgres) ไม่มีระบบล็อกอิน

---

## 1. สร้างฐานข้อมูลบน Supabase

- ล็อกอิน https://supabase.com → Create new project
- กำหนดชื่อโปรเจกต์, ตั้งรหัสผ่าน Postgres (ปลอดภัยและจำได้)
- รอ Supabase Provisioning เสร็จแล้วเปิด Project  
- ไปที่เมนู `Table Editor` หรือ `SQL Editor` ตรวจสอบว่าจะสร้างตารางเองหรือใช้สคริปต์ที่เตรียมไว้

### เปิด Row Level Security (RLS) + ตั้ง Policy
ใน SQL Editor ให้รันคำสั่งจากไฟล์ `drizzle/001_init_employees.sql`

- คำสั่งนี้จะ:
  - สร้างตาราง `employees`
  - เปิด RLS
  - อนุญาตให้ใครก็ได้ (anon) อ่านและเพิ่มข้อมูล

```sql
-- คัดลอกจาก drizzle/001_init_employees.sql
create table if not exists public.employees (
  id uuid primary key default gen_random_uuid(),
  employee_id text not null unique,
  name text not null,
  age int4 check (age >= 0),
  sex text,
  birthday date,
  country text,
  created_at timestamp with time zone default now()
);

alter table public.employees enable row level security;

create policy if not exists "Public can select employees"
on public.employees
for select
to anon
using (true);

create policy if not exists "Public can insert employees"
on public.employees
for insert
to anon
with check (true);
```

> หากต้องการ migrate ผ่าน Drizzle CLI แทน ให้ตั้งค่า `SUPABASE_DB_URL` (ดูหัวข้อถัดไป) แล้วรัน `pnpm drizzle:push`

---

## 2. ตั้งค่า Environment Variables

ไฟล์ตัวอย่าง `env.example`

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=Xooxoxoxoxoxoxoxoxooxo
SUPABASE_DB_URL=
```

ให้สร้างไฟล์ `.env.local` (สำหรับฝั่ง Next.js ทั้ง client/server) และ `.env` (สำหรับ CLI เช่น Drizzle) โดยอ้างอิง `env.example`

### หา URL & Key
- ไปที่ Supabase → Project Settings → API
  - `URL` → ก๊อปไปใส่ `NEXT_PUBLIC_SUPABASE_URL`
  - `anon public` key → ใส่ `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### หา Postgres Connection String
- ไปที่ Project Settings → Database → Connection string → เลือก “Pooler” หรือ “Direct” → Node.js
- ตัวอย่างรูปแบบ:
  - Pooler (แนะนำให้ใช้):  
    `postgresql://postgres:ENCODED_PASSWORD@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres?sslmode=require`
  - Direct:  
    `postgresql://postgres:ENCODED_PASSWORD@<project-ref>.supabase.co:5432/postgres?sslmode=require`
- หากรหัสผ่านมีอักขระพิเศษ เช่น `@` ให้ URL-encode เป็น `%40`
- นำไปใส่ใน `.env` หรือ `.env.local` ค่า `SUPABASE_DB_URL`
- Drizzle CLI จะอ่านค่าจาก `.env` โดยอัตโนมัติ (หรือ export ใน shell)

---

## 3. เริ่มรันโปรเจกต์

```bash
pnpm install
pnpm dev
```

- เปิด `http://localhost:3000/employees/new` เพื่อเพิ่มพนักงาน
- เปิด `http://localhost:3000/employees` เพื่อดูรายการ
- API:
  - `GET /api/employees` → ดึงข้อมูลทั้งหมด
  - `POST /api/employees` → เพิ่มข้อมูล (ใช้ zod ตรวจสอบฝั่ง server)

ถ้าใช้ Drizzle ทำ migration:

```bash
pnpm drizzle:generate   # สร้างไฟล์ในโฟลเดอร์ drizzle/ (optional)
pnpm drizzle:push       # ส่ง schema ไป Supabase (ต้องตั้งค่า SUPABASE_DB_URL แล้ว)
pnpm drizzle:studio     # เปิด UI studio ของ Drizzle (optional)
```

---

## 4. Supabase vs Postgres Queries ต่างกันไหม?

- Supabase ใช้ฐานข้อมูล Postgres แบบ Managed ⇒ คำสั่ง SQL คือ Postgres 100%
- สิ่งพิเศษที่ Supabase เพิ่ม:
  - ฟังก์ชันเสริม เช่น `auth`, `storage`, `edge functions`
  - Policy / RLS / Realtime ที่ช่วยบริหาร JSON ผ่าน API
- การ query ผ่าน Supabase API (REST/Client SDK) จะเป็น abstraction บน Postgres แต่เบื้องหลังยังใช้ SQL เดิม เช่น `select`, `insert`
- ดังนั้น `employee_id`, `uuid`, `timestamp` ฯลฯ จะใช้งานเหมือน Postgres ปกติ เพียงแค่เราเรียกผ่าน `supabase-js` แทนการเขียน SQL ด้วยตนเอง

---

## 5. โครงสร้างไฟล์สำคัญ

- `src/app/employees/new/page.tsx` — หน้าเพิ่มข้อมูล (Client component)
- `src/app/employees/page.tsx` — หน้าแสดงตาราง (Client component + SWR)
- `src/app/api/employees/route.ts` — API route สำหรับ GET/POST
- `src/lib/supabaseClient.ts` — สร้าง Supabase client
- `src/db/schema.ts` — Drizzle schema ของตาราง `employees`
- `drizzle/001_init_employees.sql` — SQL สำหรับสร้างตาราง + policy
- `drizzle.config.ts` — Config ให้ Drizzle รู้ตำแหน่ง schema และ credentials
- `env.example` — ตัวอย่าง Environment variables ที่ต้องเติม

---

## 6. ทดสอบ API แบบ manual

```bash
curl -X POST http://localhost:3000/api/employees \
  -H "Content-Type: application/json" \
  -d '{"employeeId":"E001","name":"Alice","age":30,"sex":"F","birthday":"1995-01-01","country":"TH"}'

curl http://localhost:3000/api/employees
```

---

หากตั้งค่า Supabase และ Env เรียบร้อย ฟรอนต์เอนด์และแบ็กเอนด์ในโปรเจกต์นี้จะทำงานครบ ทั้งเพิ่มและดึงข้อมูลพนักงานแบบไม่ต้องล็อกอิน. 
