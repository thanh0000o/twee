import { Router, type IRouter } from "express";
import { desc } from "drizzle-orm";
import { db, guestbookEntriesTable } from "@workspace/db";
import {
  CreateGuestbookEntryBody,
  CreateGuestbookEntryResponse,
  ListGuestbookEntriesResponse,
  getGuestbookSmileyError,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/guestbook", async (_req, res): Promise<void> => {
  const entries = await db
    .select()
    .from(guestbookEntriesTable)
    .orderBy(desc(guestbookEntriesTable.createdAt))
    .limit(100);

  res.json(
    ListGuestbookEntriesResponse.parse(
      entries.map((entry) => ({
        ...entry,
        createdAt: entry.createdAt.toISOString(),
      })),
    ),
  );
});

router.post("/guestbook", async (req, res): Promise<void> => {
  const parsed = CreateGuestbookEntryBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.flatten() }, "Invalid guestbook entry");
    res.status(400).json({ error: "Please enter a valid name and message." });
    return;
  }

  const name = parsed.data.name.trim();
  const message = parsed.data.message.trim();
  if (!name || !message) {
    res.status(400).json({ error: "Name and message are required." });
    return;
  }

  const smileyError = getGuestbookSmileyError(message);
  if (smileyError) {
    res.status(400).json({ error: smileyError });
    return;
  }

  const [entry] = await db
    .insert(guestbookEntriesTable)
    .values({ name, message })
    .returning();

  res.status(201).json(
    CreateGuestbookEntryResponse.parse({
      ...entry,
      createdAt: entry.createdAt.toISOString(),
    }),
  );
});

export default router;