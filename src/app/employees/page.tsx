"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import useSWR from "swr";

type Employee = {
	id: string;
	employee_id: string;
	name: string;
	age: number | null;
	sex: string | null;
	birthday: string | null;
	country: string | null;
};

const fetcher = async (url: string) => {
	const res = await fetch(url);
	if (!res.ok) throw new Error("Failed to fetch employees");
	return (await res.json()) as { data: Employee[] };
};

function formatBirthday(date: string | null) {
	if (!date) return "-";
	try {
		return new Intl.DateTimeFormat("th-TH", {
			year: "numeric",
			month: "short",
			day: "numeric",
		}).format(new Date(date));
	} catch {
		return date;
	}
}

export default function EmployeesPage() {
	const { data, error, isLoading, mutate } = useSWR<{ data: Employee[] }>("/api/employees", fetcher, {
		revalidateOnFocus: false,
	});
	const [editingId, setEditingId] = useState<string | null>(null);
	const initialFormState = {
		employeeId: "",
		name: "",
		age: "",
		sex: "",
		birthday: "",
		country: "",
	};
	const [form, setForm] = useState(initialFormState);
	const [feedback, setFeedback] = useState<string | null>(null);
	const [saving, setSaving] = useState(false);

	const rows = useMemo(() => data?.data ?? [], [data]);
	const currentEditing = rows.find((row) => row.id === editingId) ?? null;

	function resetForm() {
		setForm(initialFormState);
	}

	function handleEditClick(row: Employee) {
		if (editingId === row.id) {
			setEditingId(null);
			resetForm();
			return;
		}
		setEditingId(row.id);
		setForm({
			employeeId: row.employee_id ?? "",
			name: row.name ?? "",
			age: row.age?.toString() ?? "",
			sex: row.sex ?? "",
			birthday: row.birthday ?? "",
			country: row.country ?? "",
		});
	}

	async function handleDelete(id: string) {
		const target = rows.find((row) => row.id === id);
		if (!target) return;
		if (!window.confirm(`ลบข้อมูลของ ${target.name}?`)) return;
		setFeedback(null);
		const res = await fetch("/api/employees", {
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ id }),
		});
		const body = await res.json();
		if (!res.ok) {
			setFeedback(body.error || "ไม่สามารถลบข้อมูลได้");
			return;
		}
		setFeedback("ลบข้อมูลสำเร็จ");
		await mutate();
		if (editingId === id) {
			setEditingId(null);
			resetForm();
		}
	}

	async function handleUpdate(e: React.FormEvent) {
		e.preventDefault();
		if (!editingId) return;
		setSaving(true);
		setFeedback(null);
		const res = await fetch("/api/employees", {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				id: editingId,
				employeeId: form.employeeId,
				name: form.name,
				age: form.age ? Number(form.age) : undefined,
				sex: form.sex || undefined,
				birthday: form.birthday || undefined,
				country: form.country || undefined,
			}),
		});
		const body = await res.json();
		if (!res.ok) {
			setFeedback(body.error || "อัปเดตไม่สำเร็จ");
		} else {
			setFeedback("บันทึกข้อมูลแล้ว");
			setEditingId(null);
			resetForm();
			await mutate();
		}
		setSaving(false);
	}

	return (
		<div className="flex w-full flex-col gap-6">
			<div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
				<div>
					<h1 className="text-3xl font-semibold text-slate-900">รายชื่อพนักงาน</h1>
					<p className="text-sm text-slate-500">ดู แก้ไข หรือลบข้อมูลได้ทันที (demo mode)</p>
				</div>
				<Link
					href="/employees/new"
					className="inline-flex items-center rounded-full bg-sky-500 px-5 py-2 text-sm font-medium text-white transition hover:bg-sky-600"
				>
					+ เพิ่มพนักงานใหม่
				</Link>
			</div>

			<div className="overflow-hidden rounded-3xl border border-sky-100 bg-white/90 shadow-lg shadow-sky-50">
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-sky-100">
						<thead className="bg-sky-50/60 text-xs uppercase tracking-wide text-slate-500">
							<tr>
								<th className="px-4 py-3 text-left">Employee ID</th>
								<th className="px-4 py-3 text-left">Name</th>
								<th className="px-4 py-3 text-left">Age</th>
								<th className="px-4 py-3 text-left">Sex</th>
								<th className="px-4 py-3 text-left">Birthday</th>
								<th className="px-4 py-3 text-left">Country</th>
								<th className="px-4 py-3 text-right">Actions</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-sky-50 text-sm text-slate-700">
							{isLoading && (
								<tr>
									<td colSpan={7} className="px-4 py-6 text-center text-slate-400">
										กำลังโหลดข้อมูล...
									</td>
								</tr>
							)}
							{error && (
								<tr>
									<td colSpan={7} className="px-4 py-6 text-center text-red-500">
										ไม่สามารถดึงข้อมูลได้
									</td>
								</tr>
							)}
							{rows.length === 0 && !isLoading && !error && (
								<tr>
									<td colSpan={7} className="px-4 py-6 text-center text-slate-400">
										ยังไม่มีข้อมูล ลองเพิ่มพนักงานดูนะครับ
									</td>
								</tr>
							)}
							{rows.map((row) => (
								<tr key={row.id} className="transition hover:bg-sky-50/40">
									<td className="px-4 py-3 font-medium">{row.employee_id}</td>
									<td className="px-4 py-3">{row.name}</td>
									<td className="px-4 py-3">{row.age ?? "-"}</td>
									<td className="px-4 py-3">{row.sex ?? "-"}</td>
									<td className="px-4 py-3">{formatBirthday(row.birthday)}</td>
									<td className="px-4 py-3">{row.country ?? "-"}</td>
									<td className="px-4 py-3 text-right">
										<div className="flex justify-end gap-2">
											<button
												onClick={() => handleEditClick(row)}
												className="rounded-full border border-sky-200 px-3 py-1 text-xs font-medium text-sky-600 transition hover:border-sky-300 hover:text-sky-700"
											>
												{editingId === row.id ? "ยกเลิก" : "แก้ไข"}
											</button>
											<button
												onClick={() => handleDelete(row.id)}
												className="rounded-full border border-red-200 px-3 py-1 text-xs font-medium text-red-500 transition hover:border-red-300 hover:text-red-600"
											>
												ลบ
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{editingId && currentEditing && (
				<form
					onSubmit={handleUpdate}
					className="space-y-5 rounded-3xl border border-sky-100 bg-white/90 p-8 shadow-md shadow-sky-50"
				>
					<div className="flex justify-between">
						<div>
							<h2 className="text-xl font-semibold text-slate-900">แก้ไขข้อมูล</h2>
							<p className="text-sm text-slate-500">ID: {currentEditing.employee_id}</p>
						</div>
						<button
							type="button"
							onClick={() => {
								setEditingId(null);
								resetForm();
							}}
							className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
						>
							ปิดฟอร์ม
						</button>
					</div>

					<div className="grid gap-4 md:grid-cols-3">
						<div className="space-y-2">
							<label className="text-sm font-medium text-slate-700">Employee ID</label>
							<input
								className="w-full rounded-lg border border-sky-100 bg-white px-3 py-2 text-slate-700 outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-200"
								value={form.employeeId}
								onChange={(e) => setForm((f) => ({ ...f, employeeId: e.target.value }))}
								required
							/>
						</div>
						<div className="space-y-2 md:col-span-2">
							<label className="text-sm font-medium text-slate-700">Name</label>
							<input
								className="w-full rounded-lg border border-sky-100 bg-white px-3 py-2 text-slate-700 outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-200"
								value={form.name}
								onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
								required
							/>
						</div>
					</div>

					<div className="grid gap-4 md:grid-cols-4">
						<div className="space-y-2">
							<label className="text-sm font-medium text-slate-700">Age</label>
							<input
								type="number"
								className="w-full rounded-lg border border-sky-100 bg-white px-3 py-2 text-slate-700 outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-200"
								value={form.age}
								onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))}
							/>
						</div>
						<div className="space-y-2">
							<label className="text-sm font-medium text-slate-700">Sex</label>
							<input
								className="w-full rounded-lg border border-sky-100 bg-white px-3 py-2 text-slate-700 outline-none transition focus:border-sky-300 focus:ring-sky-200 focus:ring-2"
								value={form.sex}
								onChange={(e) => setForm((f) => ({ ...f, sex: e.target.value }))}
							/>
						</div>
						<div className="space-y-2">
							<label className="text-sm font-medium text-slate-700">Birthday</label>
							<input
								type="date"
								className="w-full rounded-lg border border-sky-100 bg-white px-3 py-2 text-slate-700 outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-200"
								value={form.birthday}
								onChange={(e) => setForm((f) => ({ ...f, birthday: e.target.value }))}
							/>
						</div>
						<div className="space-y-2">
							<label className="text-sm font-medium text-slate-700">Country</label>
							<input
								className="w-full rounded-lg border border-sky-100 bg-white px-3 py-2 text-slate-700 outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-200"
								value={form.country}
								onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
							/>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<button
							type="submit"
							disabled={saving}
							className="rounded-full bg-sky-500 px-6 py-2 text-sm font-medium text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
						>
							{saving ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
						</button>
						<button
							type="button"
							onClick={() => setEditingId(null)}
							className="rounded-full border border-slate-200 px-5 py-2 text-sm font-medium text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
						>
							ยกเลิก
						</button>
						{feedback && <span className="text-sm text-slate-500">{feedback}</span>}
					</div>
				</form>
			)}

			{!editingId && feedback && (
				<div className="rounded-2xl border border-sky-100 bg-sky-50/70 px-4 py-3 text-sm text-slate-600">
					{feedback}
				</div>
			)}
		</div>
	);
}


