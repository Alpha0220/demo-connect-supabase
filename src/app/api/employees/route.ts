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

const updateSchema = employeeSchema.extend({
	id: z.string().uuid(),
});

const deleteSchema = z.object({
	id: z.string().uuid(),
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

export async function PATCH(request: Request) {
	const json = await request.json();
	const parsed = updateSchema.safeParse(json);
	if (!parsed.success) {
		return NextResponse.json({ error: parsed.error.message }, { status: 400 });
	}
	const { id, ...rest } = parsed.data;

	const { error } = await supabase
		.from("employees")
		.update({
			employee_id: rest.employeeId,
			name: rest.name,
			age: rest.age ?? null,
			sex: rest.sex ?? null,
			birthday: rest.birthday ?? null,
			country: rest.country ?? null,
		})
		.eq("id", id);

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
	return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
	const json = await request.json();
	const parsed = deleteSchema.safeParse(json);
	if (!parsed.success) {
		return NextResponse.json({ error: parsed.error.message }, { status: 400 });
	}

	const { id } = parsed.data;
	const { error } = await supabase.from("employees").delete().eq("id", id);
	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
	return NextResponse.json({ ok: true });
}


