/** Public site origins only: never count editor previews or local checks. */
export const visitorOrigins = new Set([
  "https://thanhlambeetstwee.com",
  "https://thanhlambeetstwee.replit.app",
]);

export function canRegisterVisitor(input: {
  production: boolean;
  origin?: string;
  fetchSite?: string;
  userAgent?: string;
}) {
  return input.production
    && visitorOrigins.has(input.origin ?? "")
    && input.fetchSite === "same-origin"
    && /(?:Chrome|Firefox|Safari|Edg)\//i.test(input.userAgent ?? "")
    && !/(?:bot|crawler|spider|headless|lighthouse|playwright|puppeteer|selenium|curl|wget|preview|facebookexternalhit)/i.test(input.userAgent ?? "");
}

export const filteredVisitorCounterId = "unique-ip-filtered";
