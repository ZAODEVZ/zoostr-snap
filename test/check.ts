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
const { buildLiftedPage } = await import('../src/pages/lifted.js');
const { buildSparkPage } = await import('../src/pages/spark.js');
const authors = [{ fid: 19640, username: 'zaal', count: 100 }, { fid: 77, username: null, count: 38 }, { fid: 2, username: 'b', count: 9 }];
const casts = [{ fid: 19640, castHash: '0xa62b22dfe702cdcc76d4244d0ddcccf72aa28142' }, { fid: 77, castHash: '0x996e1fb74a03cdc31e2f2bfbb1988f9d66cfecc2' }];
Object.assign(pages, {
  lifted: buildLiftedPage('https://x.app', authors, s), liftedNoStats: buildLiftedPage('https://x.app', authors, null),
  liftedDown: buildLiftedPage('https://x.app', null, null),
  spark: buildSparkPage('https://x.app', casts, authors, s, 0), sparkNext: buildSparkPage('https://x.app', casts, authors, s, 1),
  sparkOver: buildSparkPage('https://x.app', casts, null, null, 99), sparkDown: buildSparkPage('https://x.app', null, null, null, 0),
});
const L = (pages as Record<string, { ui: { elements: Record<string, { props?: { description?: string; label?: string } }> } }>);
console.log(L.lifted.ui.elements.a0.props?.description, '|', L.lifted.ui.elements.a1b.props?.label, '|', L.sparkOver.ui.elements.tag.props?.label);
let bad = 0;
for (const [k, p] of Object.entries(pages)) {
  const r = validateSnapResponse(p as never);
  console.log(k, r.valid ? 'VALID' : 'INVALID ' + JSON.stringify(r.issues ?? r).slice(0, 400));
  if (!r.valid) bad++;
}
console.log(JSON.stringify((pages.lb.ui.elements as Record<string, {props?: {title?: string}}>).r2?.props), JSON.stringify((pages.me.ui.elements as Record<string, {props?: unknown}>).head.props), (pages.home.ui.elements.stats as {props:{content:string}}).props.content);
process.exit(bad);
