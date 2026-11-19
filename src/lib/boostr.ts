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
