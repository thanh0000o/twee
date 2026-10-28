// Every /api/* request is rewritten here (see vercel.json) and handled by the
// bundled Express API from artifacts/api-server.
import handler from "./_server.mjs";

export default function api(req, res) {
  // vercel.json passes the original path as ?__path=...; restore it so the
  // Express routes see /api/music/collection instead of /api.
  const url = new URL(req.url, "http://localhost");
  const original = url.searchParams.get("__path");
  if (original !== null) {
    url.searchParams.delete("__path");
    url.searchParams.delete("path"); // added by Vercel for the :path* parameter
    const query = url.searchParams.toString();
    req.url = `/api/${original}${query ? `?${query}` : ""}`;
  }
  return handler(req, res);
}
