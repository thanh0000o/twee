import { Router, type IRouter } from "express";
import { createHmac, timingSafeEqual } from "node:crypto";

// Keeps the radio page closed until launch. The pin lives in the RADIO_PIN
// environment variable on Vercel, never in the website code. A correct pin
// returns a pass that the browser keeps, so the visitor only types it once.
// Changing the pin on Vercel closes the page again for everyone.

const router: IRouter = Router();
const attempts = new Map<string, { count: number; until: number }>();

const currentPin = () => (process.env.RADIO_PIN ?? "").trim();
const passFor = (pin: string) => createHmac("sha256", pin).update("radio-pass-v1").digest("hex");
const same = (a: string, b: string) => {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
};

router.post("/radio/unlock", async (req, res): Promise<void> => {
  const pin = currentPin();
  if (!pin) {
    res.status(503).json({ ok: false, error: "not-set" });
    return;
  }
  const forwarded = req.headers["x-forwarded-for"];
  const ip = (Array.isArray(forwarded) ? forwarded[0] : forwarded ?? req.ip ?? "unknown").split(",")[0].trim();
  const now = Date.now();
  const entry = attempts.get(ip);
  if (entry && entry.until > now) {
    res.status(429).json({ ok: false, error: "wait" });
    return;
  }
  const given = String((req.body as { pin?: unknown } | undefined)?.pin ?? "").trim();
  // a small pause makes guessing slow
  await new Promise((resolve) => setTimeout(resolve, 350));
  if (!same(given, pin)) {
    const count = (entry?.count ?? 0) + 1;
    attempts.set(ip, { count, until: count >= 5 ? now + 60_000 : 0 });
    res.status(401).json({ ok: false, error: "wrong" });
    return;
  }
  attempts.delete(ip);
  res.json({ ok: true, pass: passFor(pin) });
});

router.post("/radio/check", (req, res): void => {
  const pin = currentPin();
  const pass = String((req.body as { pass?: unknown } | undefined)?.pass ?? "");
  res.json({ ok: Boolean(pin) && same(pass, passFor(pin)) });
});

export default router;
