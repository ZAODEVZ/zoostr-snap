# CLAUDE.md - Zlank Snap Template

## What this is

Starter template for Farcaster Snaps. Hono + Vercel + `@farcaster/snap` v1.15.1 + `@farcaster/snap-hono` v1.4.8. Lives at `/Users/zaalpanthaki/Documents/zlank-snap-template/` for now, target home is `github.com/zlank-labs/zlank-snap-template` (org TBD).

This is the v1 wedge for Zlank - a build-a-Snap platform. Reference doc: `/Users/zaalpanthaki/Documents/ZAO OS V1/research/farcaster/500-snaps-zlank-build-platform/README.md`.

## Voice + style

- No emojis. No em dashes (use hyphens).
- Mobile-first since Snaps render in feed. Default to compact UI.
- ZAO ecosystem: prefer Farcaster (not Warpcast), `[MUSIC]` text labels not music notes.

## Stack constraints

- TypeScript strict mode on. `any` banned.
- Each page = one file in `src/pages/`. Each returns a Snap JSON page. No mixing concerns.
- Reusable element factories live in `src/components/primitives.ts`. Add new factories there before duplicating elements.
- Routes registered in `src/app.ts` via `registerSnapHandler`. Keep thin (read inputs, fetch data, call page builder).
- External data fetches go in `src/lib/<source>.ts`. Don't inline fetches in pages.
- Sanitize all user input via `sanitizeInput()` in `src/utils/format.ts` before rendering.

## Don'ts

- Don't set `SKIP_JFS_VERIFICATION=true` in prod env - that disables auth.
- Don't add `console.log` to handlers - they run on Vercel, use proper logger if needed.
- Don't use `any` for `ctx.action.inputs` - cast to `string | number` and validate.
- Don't return promises from page builders - they should be sync, do data fetches in the handler.
- Don't commit `.env` or `.env.local`. Both are in `.gitignore`.
- Don't write account association keys (real `header`/`payload`/`signature`) to source - use env vars or runtime fetch.

## Build steps

```bash
npm install              # install deps
npm run dev              # local at http://localhost:3010
npm run typecheck        # tsc --noEmit
vercel --prod            # ship
```

## Adding a new page

1. Create `src/pages/mypage.ts` exporting `buildMyPage(baseUrl, ...args)` that returns the Snap JSON.
2. Use factories from `src/components/primitives.ts` (stack, text, item, badge, submitButton, openUrlButton, shareCastButton, etc.).
3. Register route in `src/app.ts`:
   ```typescript
   registerSnapHandler(app, async (ctx) => {
     const baseUrl = getBaseUrl(ctx.request);
     return buildMyPage(baseUrl);
   }, { path: '/mypage', ...skipJFS });
   ```
4. Link from another page via `submitButton('Go', \`${baseUrl}/mypage\`)`.

## State patterns

- **Form input**: `(ctx.action.inputs?.fieldName as string)` - always provide default + sanitize.
- **Direct visit vs submit**: `ctx.action.type === 'get'` means no form submitted; render input page or default state.
- **Cross-page state**: query params (`?id=42`) or external store keyed by `ctx.action.fid`.

## Allowlist for QuadWork batches

When this template is run via QuadWork, agents may only edit:

- `src/pages/**` (add new pages)
- `src/components/primitives.ts` (add factories)
- `src/utils/**` (add helpers)
- `README.md`
- `tests/**`

Agents must NOT touch:

- `src/app.ts` route registration without explicit ticket scope
- `package.json` deps without approval
- `vercel.json`
- `tsconfig.json`
- `.well-known/**` (account association is sensitive)
- `.env.example` env shape

## Reference impls in ZAO repo

- `/Users/zaalpanthaki/Documents/ZAO OS V1/duodo-snap/` - FarCon Rome music fundraiser, multi-page
- `/Users/zaalpanthaki/Documents/ZAO OS V1/nouns-snap/` - Nouns NFT explorer with async data + query-param state via viem

Both are working production Snaps. Use as authoritative pattern source.
