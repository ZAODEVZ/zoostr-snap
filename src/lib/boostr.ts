// Live Zoostr / ZABAL booster data from the Boostr API (same source as zoostr.vercel.app).
const BOOSTR_URL = process.env.BOOSTR_STATS_URL ?? 'https://boostr.sahban.dev/api/zabal/stats';

export type Contributor = {
  fid: number;
  username: string;
  followers_count: number;
  pfp_url: string;
  zabalLikesCount: number;
  zabalEnabled: boolean;
};

export type Ranked = Contributor & { rank: number };

export type BoostrStats = {
  allTimeContributors: number;
  totalBoosts: number;
  ranked: Ranked[];
};

let cache: { at: number; data: BoostrStats } | null = null;
const TTL_MS = 60_000;

function rank(list: Contributor[]): Ranked[] {
  const sorted = [...list].sort((a, b) =>
    b.zabalLikesCount !== a.zabalLikesCount
      ? b.zabalLikesCount - a.zabalLikesCount
      : b.followers_count - a.followers_count,
  );
  let r = 0;
  let last: number | null = null;
  return sorted.map((c, i) => {
    if (c.zabalLikesCount !== last) {
      r = i + 1;
      last = c.zabalLikesCount;
    }
    return { ...c, rank: r };
  });
}

type Raw = {
  success?: boolean;
  stats?: {
    allTimeContributorsCount?: number;
    totalLikesGenerated?: number;
    zabalUsers?: Contributor[];
  };
};

// Returns null when Boostr is unreachable so pages still render.
export async function getStats(): Promise<BoostrStats | null> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.data;
  try {
    const res = await fetch(BOOSTR_URL, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return cache?.data ?? null;
    const raw = (await res.json()) as Raw;
    if (!raw.success || !raw.stats) return cache?.data ?? null;
    const s = raw.stats;
    const users = (s.zabalUsers ?? []).filter(
      (u) => u && typeof u.fid === 'number' && typeof u.zabalLikesCount === 'number',
    );
    const data: BoostrStats = {
      allTimeContributors: s.allTimeContributorsCount ?? users.length,
      totalBoosts: s.totalLikesGenerated ?? users.reduce((n, u) => n + u.zabalLikesCount, 0),
      ranked: rank(users),
    };
    cache = { at: Date.now(), data };
    return data;
  } catch {
    return cache?.data ?? null;
  }
}

// ---- /authors and /casts (desk #218). Same rules: timeout, cache, null on failure.
const BOOSTR_BASE = process.env.BOOSTR_BASE_URL ?? 'https://boostr.sahban.dev/api/zabal';
const EXTRA_TTL_MS = 5 * 60_000;

export type BoostedAuthor = { fid: number; username: string | null; count: number };
export type BoostedCast = { fid: number; castHash: string };

const extraCache = new Map<string, { at: number; data: unknown }>();

async function cachedJson<T>(url: string, pick: (raw: Record<string, unknown>) => T | null): Promise<T | null> {
  const hit = extraCache.get(url);
  if (hit && Date.now() - hit.at < EXTRA_TTL_MS) return hit.data as T;
  try {
    const res = await fetch(url, { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(4000) });
    if (!res.ok) return (hit?.data as T) ?? null;
    const raw = (await res.json()) as Record<string, unknown>;
    const data = raw && raw.success ? pick(raw) : null;
    if (data === null) return (hit?.data as T) ?? null;
    extraCache.set(url, { at: Date.now(), data });
    return data;
  } catch {
    return (hit?.data as T) ?? null;
  }
}

/** Whose casts the crew boosts, most boosted first. */
export function getAuthors(): Promise<BoostedAuthor[] | null> {
  return cachedJson(`${BOOSTR_BASE}/authors`, (raw) => {
    if (!Array.isArray(raw.authors)) return null;
    return (raw.authors as BoostedAuthor[])
      .filter((a) => a && typeof a.fid === 'number' && typeof a.count === 'number')
      .sort((a, b) => b.count - a.count);
  });
}

/** The newest boosted casts, newest first. */
export function getRecentCasts(limit = 50): Promise<BoostedCast[] | null> {
  return cachedJson(`${BOOSTR_BASE}/casts?sortBy=createdAt&order=desc&limit=${limit}&offset=0`, (raw) => {
    if (!Array.isArray(raw.casts)) return null;
    return (raw.casts as BoostedCast[]).filter(
      (c) => c && typeof c.fid === 'number' && typeof c.castHash === 'string' && /^0x[0-9a-f]+$/i.test(c.castHash),
    );
  });
}
