"use client";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface Employee {
	id: string;
	employee_id: string;
	name: string;
	age: number | null;
	sex: string | null;
	birthday: string | null;
	country: string | null;
}

export default function EmployeesPage() {
	const { data, error, isLoading } = useSWR<{ data: Employee[] }>(`/api/employees`, fetcher);

	return (
		<div className="max-w-4xl mx-auto p-6 bg-white dark:bg-black text-black dark:text-white">
			<h1 className="text-2xl font-semibold mb-4">Employees</h1>
			<a href="/employees/new" className="inline-block mb-4 text-blue-600 underline">
				Add New
			</a>
			{isLoading && <p>Loading...</p>}
			{error && <p className="text-red-600">Failed to load</p>}
			<table className="w-full border-collapse">
				<thead>
					<tr className="text-left border-b">
						<th className="py-2 pr-2">Employee ID</th>
						<th className="py-2 pr-2">Name</th>
						<th className="py-2 pr-2">Age</th>
						<th className="py-2 pr-2">Sex</th>
						<th className="py-2 pr-2">Birthday</th>
						<th className="py-2 pr-2">Country</th>
					</tr>
				</thead>
				<tbody>
					{data?.data?.map((row) => (
						<tr key={row.id} className="border-b">
							<td className="py-2 pr-2">{row.employee_id}</td>
							<td className="py-2 pr-2">{row.name}</td>
							<td className="py-2 pr-2">{row.age ?? "-"}</td>
							<td className="py-2 pr-2">{row.sex ?? "-"}</td>
							<td className="py-2 pr-2">{row.birthday ?? "-"}</td>
							<td className="py-2 pr-2">{row.country ?? "-"}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}


