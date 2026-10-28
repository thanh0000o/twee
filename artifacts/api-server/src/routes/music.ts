import { Router, type IRouter } from "express";
import { GetMusicCollectionQueryParams, GetMusicCollectionResponse } from "@workspace/api-zod";

const router: IRouter = Router();
type Collection = ReturnType<typeof GetMusicCollectionResponse.parse>;
type CollectionSort = "artist" | "added";
type CollectionSortOrder = "asc" | "desc";
type DiscogsRelease = {
  instance_id: number;
  basic_information: {
    id: number;
    title: string;
    year: number;
    cover_image?: string;
    thumb?: string;
    styles?: string[];
    labels?: { name: string }[];
    artists?: { name: string; anv?: string; join?: string }[];
    formats?: { name: string; qty?: string; descriptions?: string[] }[];
  };
};
type DiscogsPage = {
  pagination: { items: number; page: number; pages: number };
  releases: DiscogsRelease[];
};

const CACHE_TTL = 5 * 60 * 1000;
const cache = new Map<string, { expires: number; data: Collection }>();
const pending = new Map<string, Promise<Collection>>();
let owner: { username: string; expires: number } | undefined;
let identityPending: Promise<string> | undefined;
let retryAfter = 0;
let lastRequest = 0;
let requestQueue = Promise.resolve();

class DiscogsUnavailable extends Error {
  constructor(readonly status: number) {
    super("Discogs collection unavailable");
  }
}

// Server-only credentials; never return identity details, notes, ratings or values.
async function discogs<T>(path: string): Promise<T> {
  const token = process.env.DISCOGS_TOKEN;
  if (!token) throw new DiscogsUnavailable(503);
  const turn = requestQueue.then(async () => {
    const delay = Math.max(0, 1100 - (Date.now() - lastRequest));
    if (delay) await new Promise(resolve => setTimeout(resolve, delay));
    lastRequest = Date.now();
  });
  requestQueue = turn.catch(() => {});
  await turn;
  const response = await fetch(`https://api.discogs.com${path}`, {
    headers: {
      Authorization: `Discogs token=${token}`,
      "User-Agent": "ThanhPortfolioMusicCollection/1.0",
      Accept: "application/vnd.discogs.v2.discogs+json",
    },
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) {
    // Do not include request headers or upstream body in logs or errors.
    throw new DiscogsUnavailable(response.status);
  }
  return await response.json() as T;
}

async function collectionOwner(): Promise<string> {
  if (owner && owner.expires > Date.now()) return owner.username;
  if (!identityPending) {
    identityPending = discogs<{ username: string }>("/oauth/identity")
      .then(identity => {
        if (typeof identity.username !== "string" || !identity.username) {
          throw new DiscogsUnavailable(502);
        }
        owner = { username: identity.username, expires: Date.now() + 15 * 60 * 1000 };
        return identity.username;
      })
      .finally(() => { identityPending = undefined; });
  }
  return identityPending;
}

function safeImage(url: string | undefined): string {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    if ((parsed.protocol === "https:" || parsed.protocol === "http:") &&
      (parsed.hostname === "discogs.com" || parsed.hostname.endsWith(".discogs.com"))) {
      parsed.protocol = "https:";
      return parsed.toString();
    }
  } catch { /* Missing artwork is represented explicitly. */ }
  return "";
}

async function loadCollection(
  page: number,
  sort: CollectionSort,
  sortOrder: CollectionSortOrder,
  perPage: number,
): Promise<Collection> {
  const username = await collectionOwner();
  const escaped = encodeURIComponent(username);
  const data = await discogs<DiscogsPage>(
    `/users/${escaped}/collection/folders/0/releases?page=${page}&per_page=${perPage}&sort=${sort}&sort_order=${sortOrder}`,
  );
  const collection = GetMusicCollectionResponse.parse({
    total: data.pagination.items,
    page: data.pagination.page,
    pages: data.pagination.pages,
    collectionUrl: `https://www.discogs.com/user/${escaped}/collection`,
    records: data.releases.map(release => {
      const info = release.basic_information;
      return {
        id: release.instance_id,
        title: info.title,
        artist: (info.artists ?? []).map((artist, index, artists) => {
          const name = (artist.anv || artist.name).replace(/\s+\(\d+\)$/, "");
          return index < artists.length - 1 ? `${name} ${artist.join || ","}` : name;
        }).join(" "),
        year: info.year,
        // Keep full-resolution artwork sharp on larger and high-DPI screens.
        // Tiny Discogs thumbnails are only a fallback for absent covers.
        image: safeImage(info.cover_image) || safeImage(info.thumb),
        format: (info.formats ?? []).map(format =>
          [Number(format.qty) > 1 ? `${format.qty}× ${format.name}` : format.name,
            ...(format.descriptions ?? []).filter(value => ["LP", "EP", "Single", "Album"].includes(value)),
          ].join(", "),
        ).join(" / "),
        url: `https://www.discogs.com/release/${info.id}`,
        styles: info.styles ?? [],
        labels: (info.labels ?? []).map(label => label.name),
      };
    }),
  });
  if (cache.size >= 20) cache.delete(cache.keys().next().value!);
  cache.set(`${sort}:${sortOrder}:${perPage}:${page}`, { data: collection, expires: Date.now() + CACHE_TTL });
  return collection;
}

router.get("/music/collection", async (req, res): Promise<void> => {
  const parsed = GetMusicCollectionQueryParams.safeParse(req.query);
  if (!parsed.success || (parsed.data.page ?? 1) > 10000) {
    res.status(400).json({ error: "A valid collection page is required." });
    return;
  }
  const page = parsed.data.page ?? 1;
  const sort = parsed.data.sort ?? "artist";
  const sortOrder = parsed.data.sort_order ?? "asc";
  const perPage = parsed.data.per_page ?? 100;
  const cacheKey = `${sort}:${sortOrder}:${perPage}:${page}`;
  const cached = cache.get(cacheKey);
  if (cached && cached.expires > Date.now()) {
    res.set("Cache-Control", "public, max-age=60").json(cached.data);
    return;
  }
  if (Date.now() < retryAfter || (!pending.has(cacheKey) && pending.size >= 4)) {
    res.set("Retry-After", "30").status(503).json({ error: "The collection is temporarily unavailable. Please try again shortly." });
    return;
  }
  try {
    let request = pending.get(cacheKey);
    if (!request) {
      request = loadCollection(page, sort, sortOrder, perPage).finally(() => { pending.delete(cacheKey); });
      pending.set(cacheKey, request);
    }
    res.set("Cache-Control", "public, max-age=60").json(await request);
  } catch (error) {
    retryAfter = Date.now() + 30000;
    req.log.warn({ upstreamStatus: error instanceof DiscogsUnavailable ? error.status : null }, "Discogs collection unavailable");
    res.set("Cache-Control", "no-store").set("Retry-After", "30").status(503)
      .json({ error: "The collection is temporarily unavailable. Please try again shortly." });
  }
});

export default router;
