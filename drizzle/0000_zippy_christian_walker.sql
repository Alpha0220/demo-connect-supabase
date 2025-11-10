CREATE TABLE "employees" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"employee_id" text NOT NULL,
	"name" text NOT NULL,
	"age" integer,
	"sex" text,
	"birthday" date,
	"country" text,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "employees_employee_id_unique" UNIQUE("employee_id")
);
