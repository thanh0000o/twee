// Run against the development API using the workspace's tsx runner.
// Only reserved documentation IPs are registered; all test hashes are removed.
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { db, pool, siteVisitorsTable } from "@workspace/db";
import { inArray } from "drizzle-orm";
import { visitorIpHash } from "../src/lib/visitor-identity";
import { initializeCommunity } from "../src/lib/initialize-community";
import { legacyGuestbook } from "../src/data/legacy-guestbook";

const base = "http://127.0.0.1:8080/api";
const getCount = async () => (await (await fetch(`${base}/visitors`)).json()).count as number;
const ips = ["192.0.2.211", "192.0.2.212"];
const keys = ips.map(ip => visitorIpHash(ip, process.env.SESSION_SECRET ?? ""));

async function run() {
  const before = await getCount();
  const imported = await (await fetch(`${base}/guestbook`)).json();
  for (const [id, name, message, date] of legacyGuestbook) {
    assert.ok(imported.some((e: {name: string; message: string; createdAt: string}) =>
      e.name === name && e.message === message && e.createdAt === date), `Missing imported entry ${id}`);
  }
  const countBeforeImport = imported.length;
  await initializeCommunity();
  assert.equal((await (await fetch(`${base}/guestbook`)).json()).length, countBeforeImport);
  assert.equal(await getCount(), before, "Repeated initialization must not reset the visitor total");
  const record = async (ip: string) => {
    const res = await fetch(`${base}/visitors`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Forwarded-For": ip },
      body: JSON.stringify({ visitorId: randomUUID() }),
    });
    assert.equal(res.status, 200);
    return res.json();
  };
  const concurrent = await Promise.all(Array.from({ length: 8 }, () => record(ips[0])));
  assert.ok(concurrent.every(r => r.count === before + 1), "One IP must count once across concurrent new browsers");
  assert.equal((await record(`::ffff:${ips[0]}`)).count, before + 1);
  assert.equal((await record(ips[1])).count, before + 2);
  console.log({ importedMessages: legacyGuestbook.length, totalMessages: imported.length,
    reimportDuplicates: false, countBeforeTest: before, sameIpAdds: 1, newIpAdds: 1 });
}

try {
  await run();
} finally {
  await db.delete(siteVisitorsTable).where(inArray(siteVisitorsTable.browserHash, keys));
  console.log({ countAfterTestCleanup: await getCount() });
  await pool.end();
}
