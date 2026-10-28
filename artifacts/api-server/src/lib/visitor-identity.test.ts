import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { legacyGuestbook } from "../data/legacy-guestbook";
import { normalizeVisitorIp, visitorIpHash } from "./visitor-identity";

test("equivalent IP spellings deduplicate, while distinct IPs do not", () => {
  const secret = "test-only-secret";
  assert.equal(normalizeVisitorIp("::ffff:192.0.2.10"), "192.0.2.10");
  assert.equal(visitorIpHash("::ffff:c000:20a", secret), visitorIpHash("192.0.2.10", secret));
  assert.equal(visitorIpHash("2001:0db8:0:0:0:0:0:1", secret), visitorIpHash("2001:db8::1", secret));
  assert.notEqual(visitorIpHash("192.0.2.10", secret), visitorIpHash("192.0.2.11", secret));
  assert.notEqual(visitorIpHash("192.0.2.10", secret), visitorIpHash("192.0.2.10", "other-secret"));
  assert.throws(() => visitorIpHash("invalid", secret));
  assert.throws(() => visitorIpHash("192.0.2.10", ""));
});

test("all 38 imported names, messages and precise timestamps match the owner's export", () => {
  const source = readFileSync(new URL("../../../../attached_assets/Pasted-1-linky-linky-was-here-2026-01-09T14-52-36-772Z-2-linky_1792408061577.txt", import.meta.url), "utf8");
  const lines = source.trim().split(/\r?\n/);
  assert.equal(legacyGuestbook.length, 38);
  assert.equal(lines.length, legacyGuestbook.length);
  legacyGuestbook.forEach(([id, name, message, timestamp], index) => {
    assert.equal([id, name, message, timestamp].join("\t"), lines[index]);
    assert.equal(new Date(timestamp).toISOString(), timestamp);
  });
});
