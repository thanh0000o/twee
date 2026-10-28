import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const siteVisitorsTable = pgTable("site_visitors", {
  // Legacy browser hashes remain intact; new entries are prefixed, keyed IP hashes.
  browserHash: text("browser_hash").primaryKey(),
});

export const insertSiteVisitorSchema = createInsertSchema(siteVisitorsTable);
export type InsertSiteVisitor = z.infer<typeof insertSiteVisitorSchema>;
export type SiteVisitor = typeof siteVisitorsTable.$inferSelect;

export const visitorCounterTable = pgTable("visitor_counter", {
  id: text("id").primaryKey(),
  baseline: integer("baseline").notNull(),
});
export const insertVisitorCounterSchema = createInsertSchema(visitorCounterTable);
export type VisitorCounter = typeof visitorCounterTable.$inferSelect;
export type InsertVisitorCounter = z.infer<typeof insertVisitorCounterSchema>;
