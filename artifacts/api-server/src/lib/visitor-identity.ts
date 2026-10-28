import { createHmac } from "node:crypto";
import { isIP } from "node:net";

/** Canonicalize equivalent IPv6 spellings and IPv4-mapped addresses. */
export function normalizeVisitorIp(value: string): string {
  const ip = value.trim();
  const version = isIP(ip);
  if (!version) throw new Error("A valid client IP address is required.");
  if (version === 4) return ip;
  const normalized = new URL(`http://[${ip}]/`).hostname.slice(1, -1);
  const mapped = normalized.match(/^::ffff:([0-9a-f]+):([0-9a-f]+)$/);
  if (!mapped) return normalized;
  const high = parseInt(mapped[1], 16);
  const low = parseInt(mapped[2], 16);
  return `${high >> 8}.${high & 255}.${low >> 8}.${low & 255}`;
}

export function visitorIpHash(ip: string, secret: string): string {
  if (!secret) throw new Error("SESSION_SECRET is required for anonymous IP counting.");
  return `ip:${createHmac("sha256", secret).update(`visitor-ip:${normalizeVisitorIp(ip)}`).digest("hex")}`;
}
