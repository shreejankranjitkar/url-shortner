import {pgTable, uuid, varchar, timestamp} from "drizzle-orm/pg-core"
import { usersTable } from "./auth.model.js"

export const urlsTable = pgTable("urls", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid().references(() => usersTable.id).notNull(),
    targetUrl: varchar("target_url", {length: 255}).notNull(),
    shortCode: varchar("short_code", {length: 25}).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()).notNull()

})