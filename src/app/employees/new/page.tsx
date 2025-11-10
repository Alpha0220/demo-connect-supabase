"use client";
import { useState } from "react";

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
		<div className="max-w-xl mx-auto p-6">
			<h1 className="text-2xl font-semibold mb-4">Add New Employee</h1>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label className="block text-sm font-medium">Employee ID</label>
					<input className="mt-1 w-full border rounded px-3 py-2" value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} required />
				</div>
				<div>
					<label className="block text-sm font-medium">Name</label>
					<input className="mt-1 w-full border rounded px-3 py-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
				</div>
				<div className="grid grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-medium">Age</label>
						<input type="number" className="mt-1 w-full border rounded px-3 py-2" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
					</div>
					<div>
						<label className="block text-sm font-medium">Sex</label>
						<input className="mt-1 w-full border rounded px-3 py-2" value={form.sex} onChange={(e) => setForm({ ...form, sex: e.target.value })} placeholder="M/F" />
					</div>
				</div>
				<div className="grid grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-medium">Birthday</label>
						<input type="date" className="mt-1 w-full border rounded px-3 py-2" value={form.birthday} onChange={(e) => setForm({ ...form, birthday: e.target.value })} />
					</div>
					<div>
						<label className="block text-sm font-medium">Country</label>
						<input className="mt-1 w-full border rounded px-3 py-2" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
					</div>
				</div>
				<button disabled={submitting} className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50">
					{submitting ? "Saving..." : "Save"}
				</button>
			</form>
			{message && <p className="mt-3 text-sm">{message}</p>}
		</div>
	);
}

export default function Page() {
	return <AddEmployeeForm />;
}


