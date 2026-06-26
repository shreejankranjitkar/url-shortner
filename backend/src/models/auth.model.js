import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core"


export const usersTable = pgTable("users", {
    id: uuid().primaryKey().defaultRandom(),
    firstname: varchar("first_name", { length: 255 }).notNull(),
    lastname: varchar("last_name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()).notNull()
})