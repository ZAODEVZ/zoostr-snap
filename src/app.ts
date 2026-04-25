import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { registerSnapHandler } from '@farcaster/snap-hono';
import { getBaseUrl } from './utils/url.js';
import { sanitizeInput } from './utils/format.js';
import { buildHomePage } from './pages/home.js';
import { buildFormPage } from './pages/form.js';
import { buildResultPage } from './pages/result.js';

const app = new Hono();
app.use('*', cors({ origin: '*' }));

const skipJFS: { skipJFSVerification: boolean } = {
  skipJFSVerification: process.env.SKIP_JFS_VERIFICATION === 'true',
};

// -- Home page (landing) --------------------------------------------------

registerSnapHandler(app, async (ctx) => {
  const baseUrl = getBaseUrl(ctx.request);
  return buildHomePage(baseUrl);
}, skipJFS);

// -- Form page (input demo) -----------------------------------------------

registerSnapHandler(
  app,
  async (ctx) => {
    const baseUrl = getBaseUrl(ctx.request);
    return buildFormPage(baseUrl);
  },
  { path: '/form', ...skipJFS },
);

// -- Result page (reads input + renders personalized) ---------------------

registerSnapHandler(
  app,
  async (ctx) => {
    const baseUrl = getBaseUrl(ctx.request);

    // ctx.action.type === 'get' on direct visit (no submitted form)
    if (ctx.action.type === 'get') {
      return buildFormPage(baseUrl);
    }

    const raw = (ctx.action.inputs?.name as string) || 'anon';
    const name = sanitizeInput(raw, 30) || 'anon';

    return buildResultPage(baseUrl, name);
  },
  { path: '/result', ...skipJFS },
);

export default app;
