# Zlank Snap Template

Starter for building Farcaster Snaps. Hono + Vercel + `@farcaster/snap`. Multi-page, themed, includes form input + state passing + share-cast pattern.

## What is a Snap

Farcaster's new in-feed UI primitive. Server returns JSON pages, the Farcaster client renders 16 standard UI components (text, buttons, inputs, images, badges, etc.). Sits between Frames v1 (image-based) and Mini Apps v2 (full web app).

Spec published March 27, 2026 - still beta. SDK is `@farcaster/snap` v1.15.1 + `@farcaster/snap-hono` v1.4.8.

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev   # http://localhost:3010
```

Visit `http://localhost:3010/?type=app` to render the home page in the Farcaster Snap emulator format.

## Structure

```
api/index.ts                  Vercel serverless wrapper - just re-exports src/app.ts
src/server.ts                 Local dev bootstrap (Node)
src/app.ts                    Hono app, routes via registerSnapHandler
src/pages/                    One file per page builder (returns a Snap JSON page)
  home.ts                       Landing page
  form.ts                       Input demo
  result.ts                     Personalized result reading ctx.action.inputs
src/components/primitives.ts  Reusable factories (stack, text, item, button variants, badge, image, etc.)
src/utils/                    url + format helpers
.well-known/farcaster.json.example   Manifest template (account association + frame metadata)
vercel.json                   Rewrites all paths to /api so Hono handles routing
```

## Add a new page

1. Create `src/pages/mypage.ts` - export a `buildMyPage(baseUrl, ...args)` returning the Snap JSON.
2. In `src/app.ts` register a handler at the route:
   ```typescript
   registerSnapHandler(app, async (ctx) => {
     const baseUrl = getBaseUrl(ctx.request);
     return buildMyPage(baseUrl);
   }, { path: '/mypage', ...skipJFS });
   ```
3. Reference it from another page via `submitButton('Go', \`${baseUrl}/mypage\`)`.

## Patterns

**Read form input.** When a user submits a form on page A targeting page B, page B's handler receives `ctx.action.inputs.fieldName` (whatever you named the `input` element in the page).

```typescript
const value = (ctx.action.inputs?.fieldName as string) || 'default';
```

**Initial render vs submit.** `ctx.action.type === 'get'` means direct visit (no form submitted). Use this to show the input page or default state.

**Pass state across pages.** Snaps are stateless POST handlers. To carry state:
- Query params: `submitButton('X', \`${baseUrl}/route?id=42\`)` then read `new URL(ctx.request.url).searchParams.get('id')` in the handler.
- External store: Supabase, Redis, KV. Persist by user FID (read from `ctx.action.fid`).

**Theme.** Set `theme: { accent: 'purple' }` per page. Accent colors: purple, red, green, amber, gray, blue. Component badges accept their own color.

**Share back to feed.** `shareCastButton(label, text, embeds)` opens the cast composer with prefilled text + embeds.

**Open mini app.** `openMiniAppButton(label, target, opts)` deep-links to a Farcaster mini app URL.

**View profile.** `viewProfileButton(label, fid)` opens the profile drawer for a given FID.

## Deploy

```bash
npm i -g vercel    # if not installed
vercel             # first time = link
vercel --prod      # ship it
```

Set `SNAP_PUBLIC_BASE_URL` env on Vercel to your deployed URL. Do NOT set `SKIP_JFS_VERIFICATION=true` in prod.

## Account association (production)

To get the verified-Snap badge in Farcaster, sign your domain with your app's wallet:

1. Generate the account association payload using your app wallet (EIP-712 sign)
2. Replace placeholders in `.well-known/farcaster.json.example` with real values
3. Rename to `.well-known/farcaster.json` and serve it (add a Hono GET route for the path)

Tooling: `@farcaster/snap` exposes helpers, or use the official Snap dashboard once it's live.

## Reference Snaps in the wild

- duodo-snap (FarCon Rome music fundraiser, multi-page, share + open_mini_app)
- nouns-snap (Nouns NFT explorer, async data fetch via viem, query-param state)
- Official examples at https://github.com/farcasterxyz/snap/tree/main/examples
- FreeSnap Builder (AI Snap builder by @mattlee, closest existing competitor for non-coder UX)

## License

MIT. Fork it, ship it, share it.
