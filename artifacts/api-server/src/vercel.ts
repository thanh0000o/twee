import type { IncomingMessage, ServerResponse } from "node:http";
import app from "./app";
import { initializeCommunity } from "./lib/initialize-community";
import { logger } from "./lib/logger";

// Entry point for Vercel. The guestbook import and visitor counter setup ran
// once at server start on Replit; here it runs once per cold start.
// If the database is unreachable, the music page still works; the setup is
// retried on the next request.
let ready: Promise<void> | null = null;

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  ready ??= initializeCommunity().catch((err: unknown) => {
    ready = null;
    logger.error({ err }, "Could not initialize guestbook import and visitor counter");
  });
  await ready;
  return app(req as Parameters<typeof app>[0], res as Parameters<typeof app>[1]);
}
