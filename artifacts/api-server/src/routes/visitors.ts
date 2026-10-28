import { Router, type IRouter } from "express";
import { count, eq, like } from "drizzle-orm";
import { db, siteVisitorsTable, visitorCounterTable } from "@workspace/db";
import { RecordVisitorBody, RecordVisitorResponse, GetVisitorCountResponse } from "@workspace/api-zod";
import { visitorIpHash } from "../lib/visitor-identity";
import { canRegisterVisitor, filteredVisitorCounterId } from "../lib/visitor-policy";

const router: IRouter = Router();

async function totalVisitors() {
  const [counter] = await db.select().from(visitorCounterTable).where(eq(visitorCounterTable.id, filteredVisitorCounterId));
  if (!counter) throw new Error("Visitor counter has not been initialized.");
  const [total] = await db.select({ count: count() }).from(siteVisitorsTable).where(like(siteVisitorsTable.browserHash, "ip:%"));
  return { count: counter.baseline + total.count };
}

router.get("/visitors", async (req, res): Promise<void> => {
  res.set("Cache-Control", "no-store");
  try {
    res.json(GetVisitorCountResponse.parse(await totalVisitors()));
  } catch (error) {
    req.log.error({ err: error }, "Visitor count unavailable");
    res.status(503).json({ error: "Visitor count temporarily unavailable." });
  }
});

router.post("/visitors", async (req, res): Promise<void> => {
  res.set("Cache-Control", "no-store");
  const parsed = RecordVisitorBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "A valid anonymous browser identifier is required." });
    return;
  }
  try {
    if (!canRegisterVisitor({
      production: process.env.NODE_ENV === "production",
      origin: req.get("origin"),
      fetchSite: req.get("sec-fetch-site"),
      userAgent: req.get("user-agent"),
    })) {
      res.json(RecordVisitorResponse.parse(await totalVisitors()));
      return;
    }
    // Replit's ingress supplies the originating client as the first forwarded IP.
    // The legacy visitorId body field is accepted for API compatibility, not identity.
    const ip = req.get("x-forwarded-for")?.split(",")[0]?.trim() || req.socket.remoteAddress;
    if (!ip) throw new Error("Client IP address unavailable.");
    const browserHash = visitorIpHash(ip, process.env.SESSION_SECRET ?? "");
    await db.insert(siteVisitorsTable).values({ browserHash }).onConflictDoNothing();
    res.json(RecordVisitorResponse.parse(await totalVisitors()));
  } catch (error) {
    req.log.error({ err: error }, "Visitor registration unavailable");
    res.status(503).json({ error: "Visitor count temporarily unavailable." });
  }
});

export default router;
