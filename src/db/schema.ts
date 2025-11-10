import { pgTable, text, uuid, integer, date, timestamp } from "drizzle-orm/pg-core";

export const employees = pgTable("employees", {
	id: uuid("id").defaultRandom().primaryKey(),
	employeeId: text("employee_id").notNull().unique(),
	name: text("name").notNull(),
	age: integer("age"),
	sex: text("sex"),
	birthday: date("birthday"),
	country: text("country"),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});


