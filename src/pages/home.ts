import {
  stack, text, item, badge, separator,
  submitButton, openUrlButton, shareCastButton,
} from '../components/primitives.js';
import type { BoostrStats } from '../lib/boostr.js';
import { LINKS } from '../lib/links.js';
import { fmt } from '../utils/format.js';

export function buildHomePage(baseUrl: string, stats: BoostrStats | null) {
  const statLine = stats
    ? `${fmt(stats.allTimeContributors)} boosters, ${fmt(stats.totalBoosts)} boosts so far`
    : 'Live booster stats are on the leaderboard';
  return {
    version: '1.0' as const,
    theme: { accent: 'amber' as const },
    ui: {
      root: 'page',
      elements: {
        page: stack('vertical', 'md', ['header', 'desc', 'stats', 'div1', 'row1', 'row2']),

        header: { ...item('Zoostr', 'ZABAL x Boostr, the first Sparkz launch'), children: ['live'] },
        live: badge('Empire live', 'green'),

        desc: text('Boost ZABAL casts on Farcaster to earn points. Top boosters lead the Zoostr Empire on Base.', { size: 'sm' }),
        stats: text(statLine, { weight: 'bold', size: 'sm' }),

        div1: separator(),

        row1: stack('horizontal', 'sm', ['lb_btn', 'me_btn']),
        lb_btn: submitButton('Leaderboard', `${baseUrl}/leaderboard`, { variant: 'primary' }),
        me_btn: submitButton('My rank', `${baseUrl}/me`),

        row2: stack('horizontal', 'sm', ['empire_btn', 'hearth_btn', 'share_btn']),
        empire_btn: openUrlButton('Empire', LINKS.empire),
        hearth_btn: openUrlButton('Sparkz', LINKS.hearth),
        share_btn: shareCastButton('Share', 'Zoostr is live: boost ZABAL, climb the board', [baseUrl]),
      },
    },
  };
}
