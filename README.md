# Zoostr Snap

Farcaster Snap for Zoostr: live Boostr stats, top 5 leaderboard, your rank, and links to the Zoostr Empire and the Sparkz Hearth.

- Data: `https://boostr.sahban.dev/api/zabal/stats` (override with `BOOSTR_STATS_URL`)
- Pages: `/` home, `/leaderboard`, `/me`
- Check: `npx tsx test/check.ts` validates every screen
- Dev: `npm run dev`, deploy on Vercel (`api/index.ts`)

Built from bettercallzaal/zlank-snap-template.
