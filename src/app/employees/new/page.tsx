"use client";
import { useState } from "react";
import Link from "next/link";

function AddEmployeeForm() {
	const [form, setForm] = useState({
		employeeId: "",
		name: "",
		age: "",
		sex: "",
		birthday: "",
		country: "",
	});
	const [submitting, setSubmitting] = useState(false);
	const [message, setMessage] = useState<string | null>(null);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setSubmitting(true);
		setMessage(null);
		try {
			const res = await fetch("/api/employees", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					employeeId: form.employeeId,
					name: form.name,
					age: form.age ? Number(form.age) : undefined,
					sex: form.sex || undefined,
					birthday: form.birthday || undefined,
					country: form.country || undefined,
				}),
			});
			const body = await res.json();
			if (!res.ok) throw new Error(body.error || "Failed to add");
			setMessage("Saved!");
			setForm({
				employeeId: "",
				name: "",
				age: "",
				sex: "",
				birthday: "",
				country: "",
			});
		} catch (err: unknown) {
			if (err instanceof Error) {
				setMessage(err.message);
			} else {
				setMessage("An unknown error occurred");
			}
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<div className="w-full">
			<div className="mb-6 flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-semibold text-slate-900">เพิ่มพนักงานใหม่</h1>
					<p className="text-sm text-slate-500">ข้อมูลทั้งหมดจะถูกบันทึกลง Supabase โดยตรง</p>
				</div>
				<Link
					href="/employees"
					className="rounded-full border border-sky-200 bg-white px-4 py-2 text-sm font-medium text-sky-600 transition hover:border-sky-300 hover:text-sky-700"
				>
					ดูรายการทั้งหมด
				</Link>
			</div>

			<form
				onSubmit={handleSubmit}
				className="space-y-6 rounded-3xl border border-sky-100 bg-white/90 p-8 shadow-lg shadow-sky-50"
			>
				<div className="grid gap-4 md:grid-cols-2">
					<div className="space-y-2">
						<label className="text-sm font-medium text-slate-700">Employee ID</label>
						<input
							className="w-full rounded-lg border border-sky-100 bg-white px-3 py-2 text-slate-700 outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-200"
							value={form.employeeId}
							onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
							required
						/>
					</div>
					<div className="space-y-2">
						<label className="text-sm font-medium text-slate-700">Name</label>
						<input
							className="w-full rounded-lg border border-sky-100 bg-white px-3 py-2 text-slate-700 outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-200"
							value={form.name}
							onChange={(e) => setForm({ ...form, name: e.target.value })}
							required
						/>
					</div>
				</div>

				<div className="grid gap-4 md:grid-cols-3">
					<div className="space-y-2">
						<label className="text-sm font-medium text-slate-700">Age</label>
						<input
							type="number"
							className="w-full rounded-lg border border-sky-100 bg-white px-3 py-2 text-slate-700 outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-200"
							value={form.age}
							onChange={(e) => setForm({ ...form, age: e.target.value })}
						/>
					</div>
					<div className="space-y-2">
						<label className="text-sm font-medium text-slate-700">Sex</label>
						<input
							className="w-full rounded-lg border border-sky-100 bg-white px-3 py-2 text-slate-700 outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-200"
							value={form.sex}
							onChange={(e) => setForm({ ...form, sex: e.target.value })}
							placeholder="M/F"
						/>
					</div>
					<div className="space-y-2">
						<label className="text-sm font-medium text-slate-700">Country</label>
						<input
							className="w-full rounded-lg border border-sky-100 bg-white px-3 py-2 text-slate-700 outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-200"
							value={form.country}
							onChange={(e) => setForm({ ...form, country: e.target.value })}
						/>
					</div>
				</div>

				<div className="space-y-2">
					<label className="text-sm font-medium text-slate-700">Birthday</label>
					<input
						type="date"
						className="w-full rounded-lg border border-sky-100 bg-white px-3 py-2 text-slate-700 outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-200"
						value={form.birthday}
						onChange={(e) => setForm({ ...form, birthday: e.target.value })}
					/>
				</div>

				<button
					disabled={submitting}
					className="inline-flex items-center justify-center rounded-full bg-sky-500 px-6 py-2 font-medium text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
				>
					{submitting ? "Saving..." : "บันทึกข้อมูล"}
				</button>

				{message && (
					<p className="rounded-lg border border-sky-100 bg-sky-50 px-3 py-2 text-sm text-slate-600">
						{message}
					</p>
				)}
			</form>
		</div>
	);
}

export default function Page() {
	return <AddEmployeeForm />;
}


