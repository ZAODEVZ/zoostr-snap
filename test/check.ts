import { validateSnapResponse } from '@farcaster/snap';
const fixture = { success: true, stats: { allTimeContributorsCount: 3, totalLikesGenerated: 300, zabalUsers: [
  { fid: 19640, username: 'bettercallzaal', followers_count: 9000, pfp_url: '', zabalLikesCount: 120, zabalEnabled: true },
  { fid: 2, username: 'b', followers_count: 10, pfp_url: '', zabalLikesCount: 90, zabalEnabled: true },
  { fid: 3, username: 'c<x>', followers_count: 5, pfp_url: '', zabalLikesCount: 90, zabalEnabled: true },
  { fid: 4, username: 'd', followers_count: 5, pfp_url: '', zabalLikesCount: 40, zabalEnabled: true },
  { fid: 5, username: 'e', followers_count: 5, pfp_url: '', zabalLikesCount: 30, zabalEnabled: true },
  { fid: 6, username: 'f', followers_count: 5, pfp_url: '', zabalLikesCount: 20, zabalEnabled: true },
] } };
process.env.BOOSTR_STATS_URL = 'data:application/json,' + encodeURIComponent(JSON.stringify(fixture));
const { getStats } = await import('../src/lib/boostr.js');
const { buildHomePage } = await import('../src/pages/home.js');
const { buildLeaderboardPage } = await import('../src/pages/leaderboard.js');
const { buildMePage } = await import('../src/pages/me.js');
const s = await getStats();
const pages = { home: buildHomePage('https://x.app', s), lb: buildLeaderboardPage('https://x.app', s),
  me: buildMePage('https://x.app', s, 19640), meNone: buildMePage('https://x.app', s, 999),
  homeDown: buildHomePage('https://x.app', null), lbDown: buildLeaderboardPage('https://x.app', null) };
let bad = 0;
for (const [k, p] of Object.entries(pages)) {
  const r = validateSnapResponse(p as never);
  console.log(k, r.valid ? 'VALID' : 'INVALID ' + JSON.stringify(r.issues ?? r).slice(0, 400));
  if (!r.valid) bad++;
}
console.log(JSON.stringify((pages.lb.ui.elements as Record<string, {props?: {title?: string}}>).r2?.props), JSON.stringify((pages.me.ui.elements as Record<string, {props?: unknown}>).head.props), (pages.home.ui.elements.stats as {props:{content:string}}).props.content);
process.exit(bad);
