# Zoostr Snap

Farcaster Snap for Zoostr: live Boostr stats, top 5 leaderboard, your rank, and links to the Zoostr Empire and the Sparkz Hearth.

- Data: `https://boostr.sahban.dev/api/zabal/stats` (override with `BOOSTR_STATS_URL`)
- Pages: `/` home, `/leaderboard` (top givers), `/me`, `/lifted` (whose casts the crew boosts, and whether they give back), `/spark` (newest boosted cast, Next walks the last 50)
- Also reads `/api/zabal/authors` and `/api/zabal/casts` (override base with `BOOSTR_BASE_URL`), 5 min cache, numbers hidden when Boostr is down
- Credit: Boostr by cashlessman.eth. Auto-likes are opt-in and unpaid.
- Check: `npx tsx test/check.ts` validates every screen
- Dev: `npm run dev`, deploy on Vercel (`api/index.ts`)

Built from bettercallzaal/zlank-snap-template.
