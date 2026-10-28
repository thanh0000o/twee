import { pgTable, serial, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const guestbookEntriesTable = pgTable("guestbook_entries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  legacyKey: text("legacy_key"),
}, (table) => [uniqueIndex("guestbook_entries_legacy_key_unique").on(table.legacyKey)]);

export const insertGuestbookEntrySchema = createInsertSchema(
  guestbookEntriesTable,
).omit({ id: true, createdAt: true, legacyKey: true });

export type InsertGuestbookEntry = z.infer<
  typeof insertGuestbookEntrySchema
>;
export type GuestbookEntry = typeof guestbookEntriesTable.$inferSelect;