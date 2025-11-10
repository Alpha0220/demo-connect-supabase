"use client";

import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
	return (
		<div className="flex w-full flex-col items-center justify-center gap-12 py-12">
			<section className="flex w-full flex-col items-center gap-8 rounded-3xl bg-white/90 p-10 shadow-lg shadow-sky-100 ring-1 ring-sky-100">
				<div className="flex flex-col items-center gap-6 text-center">
					<div className="relative h-28 w-28">
						<Image
							src="/supabase-logo.png"
							alt="Supabase Logo"
							fill
							className="object-contain drop-shadow-md"
							priority
						/>
					</div>
					<div className="space-y-3">
						<h1 className="text-4xl font-semibold text-slate-900">
							Supabase Employee Console
						</h1>
						<p className="max-w-2xl text-base text-slate-600">
							แดชบอร์ดตัวอย่างบน Next.js + Supabase สำหรับทดลอง Insert / Query ข้อมูลพนักงานแบบเรียลไทม์
							รองรับการเพิ่ม แก้ไข ลบ และดูรายการทั้งหมดในทันทีโดยไม่ต้องล็อกอิน
						</p>
					</div>
				</div>
				<div className="flex flex-wrap items-center justify-center gap-3">
					<Link
						href="/employees"
						className="rounded-full bg-sky-500 px-6 py-2 text-white shadow-sm transition hover:bg-sky-600"
					>
						ดูพนักงานทั้งหมด
					</Link>
					<Link
						href="/employees/new"
						className="rounded-full border border-sky-200 bg-white px-6 py-2 text-sky-600 transition hover:border-sky-300 hover:text-sky-700"
					>
						เพิ่มพนักงานใหม่
					</Link>
					<Link
						href="/employees?demo=test-query"
						className="rounded-full bg-slate-900 px-6 py-2 text-white transition hover:bg-slate-800"
					>
						ทดลอง Query แบบเร็ว
					</Link>
				</div>
			</section>

			<section className="grid w-full gap-6 md:grid-cols-3">
				{[
					{
						title: "Insert",
						desc: "เพิ่มข้อมูลพนักงานใหม่ด้วยฟอร์มแบบ client-side ส่งผ่าน API ไปยัง Supabase",
					},
					{
						title: "Query",
						desc: "ใช้ Supabase client ดึงข้อมูลแบบ real-time friendly พร้อม SWR cache/mutate",
					},
					{
						title: "Manage",
						desc: "แก้ไขหรือลบข้อมูลได้โดยตรง พร้อม RLS Policy ที่อนุญาตแบบ public demo",
					},
				].map((item) => (
					<div
						key={item.title}
						className="rounded-2xl border border-sky-100 bg-white/80 p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
					>
						<h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
						<p className="mt-2 text-sm leading-relaxed text-slate-600">{item.desc}</p>
					</div>
				))}
			</section>
		</div>
	);
}
