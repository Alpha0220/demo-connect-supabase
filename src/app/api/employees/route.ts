import { NextResponse } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabaseClient";

const employeeSchema = z.object({
	employeeId: z.string().min(1),
	name: z.string().min(1),
	age: z.number().int().nonnegative().optional(),
	sex: z.string().optional(),
	birthday: z.string().optional(), // ISO date
	country: z.string().optional(),
});

export async function GET() {
	const { data, error } = await supabase
		.from("employees")
		.select("*")
		.order("created_at", { ascending: false });

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
	return NextResponse.json({ data });
}

export async function POST(request: Request) {
	const json = await request.json();
	const parsed = employeeSchema.safeParse(json);
	if (!parsed.success) {
		return NextResponse.json({ error: parsed.error.message }, { status: 400 });
	}
	const payload = parsed.data;

	const { error } = await supabase.from("employees").insert({
		employee_id: payload.employeeId,
		name: payload.name,
		age: payload.age ?? null,
		sex: payload.sex ?? null,
		birthday: payload.birthday ?? null,
		country: payload.country ?? null,
	});

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
	return NextResponse.json({ ok: true });
}


