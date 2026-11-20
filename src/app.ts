import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { registerSnapHandler } from '@farcaster/snap-hono';
import { getBaseUrl } from './utils/url.js';
import { getStats, getAuthors, getRecentCasts } from './lib/boostr.js';
import { buildHomePage } from './pages/home.js';
import { buildLeaderboardPage } from './pages/leaderboard.js';
import { buildMePage } from './pages/me.js';
import { buildLiftedPage } from './pages/lifted.js';
import { buildSparkPage } from './pages/spark.js';

const app = new Hono();
app.use('*', cors({ origin: '*' }));

const skipJFS: { skipJFSVerification: boolean } = {
  skipJFSVerification: process.env.SKIP_JFS_VERIFICATION === 'true',
};

registerSnapHandler(app, async (ctx) => {
  const baseUrl = getBaseUrl(ctx.request);
  return buildHomePage(baseUrl, await getStats());
}, skipJFS);

registerSnapHandler(
  app,
  async (ctx) => {
    const baseUrl = getBaseUrl(ctx.request);
    return buildLeaderboardPage(baseUrl, await getStats());
  },
  { path: '/leaderboard', ...skipJFS },
);

registerSnapHandler(
  app,
  async (ctx) => {
    const baseUrl = getBaseUrl(ctx.request);
    // On a direct GET there is no signed user, so show the not-on-board state.
    const fid = ctx.action.type === 'get' ? null : Number(ctx.action.fid);
    return buildMePage(baseUrl, await getStats(), Number.isFinite(fid) ? fid : null);
  },
  { path: '/me', ...skipJFS },
);

registerSnapHandler(
  app,
  async (ctx) => {
    const baseUrl = getBaseUrl(ctx.request);
    const [authors, stats] = await Promise.all([getAuthors(), getStats()]);
    return buildLiftedPage(baseUrl, authors, stats);
  },
  { path: '/lifted', ...skipJFS },
);

registerSnapHandler(
  app,
  async (ctx) => {
    const baseUrl = getBaseUrl(ctx.request);
    const i = Number(new URL(ctx.request.url).searchParams.get('i') ?? 0);
    const [casts, authors, stats] = await Promise.all([getRecentCasts(), getAuthors(), getStats()]);
    return buildSparkPage(baseUrl, casts, authors, stats, Number.isFinite(i) ? i : 0);
  },
  { path: '/spark', ...skipJFS },
);

export default app;

