import { db, guestbookEntriesTable, visitorCounterTable } from "@workspace/db";
import { legacyGuestbook } from "../data/legacy-guestbook";
import { sql } from "drizzle-orm";
import { filteredVisitorCounterId } from "./visitor-policy";

/** Safe on repeated starts and across multiple server instances; never resets live data. */
export async function initializeCommunity() {
  await db.transaction(async (tx) => {
    await tx.insert(visitorCounterTable)
      .values({ id: "unique-ip", baseline: 113 })
      .onConflictDoNothing();
    // Owner-requested one-time correction to 116. Retain all IP hashes for
    // deduplication; the new offset is persisted, never recalculated on restart.
    await tx.execute(sql`
      INSERT INTO visitor_counter (id, baseline)
      SELECT ${filteredVisitorCounterId}, 116 - count(*)::integer
      FROM site_visitors WHERE browser_hash LIKE 'ip:%'
      ON CONFLICT (id) DO NOTHING
    `);
    await tx.insert(guestbookEntriesTable)
      .values(legacyGuestbook.map(([id, name, message, timestamp]) => ({
        legacyKey: `previous-guestbook:${id}`,
        name,
        message,
        createdAt: new Date(timestamp),
      })))
      .onConflictDoNothing({ target: guestbookEntriesTable.legacyKey });
  });
}
