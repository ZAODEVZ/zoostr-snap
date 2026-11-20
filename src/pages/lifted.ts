// "Who the crew lifts" (desk #218 idea 5, givers and getters): whose casts get
// boosted most, next to how many likes each of them gives back. A top boosted
// member who is not auto-liking yet is the person to invite.
import { stack, text, item, badge, submitButton } from '../components/primitives.js';
import type { BoostrStats, BoostedAuthor } from '../lib/boostr.js';
import { CREDIT } from '../lib/links.js';
import { fmt, handle } from '../utils/format.js';

const TOP = 5;

export function buildLiftedPage(baseUrl: string, authors: BoostedAuthor[] | null, stats: BoostrStats | null) {
  const top = authors?.slice(0, TOP) ?? [];
  const givers = new Map((stats?.ranked ?? []).map((c) => [c.fid, c]));
  const els: Record<string, unknown> = {};
  const rows: string[] = [];

  if (top.length === 0) {
    els.empty = text('Boostr did not answer just now. Try again in a minute.', { size: 'sm' });
    rows.push('empty');
  } else {
    top.forEach((a, i) => {
      const id = `a${i}`;
      const g = givers.get(a.fid);
      const name = handle(a.username || g?.username, a.fid);
      // Only say "gives" when the stats call answered; never show a 0 we did not read.
      const desc = !stats
        ? `${fmt(a.count)} casts boosted`
        : g && g.zabalLikesCount > 0
          ? `${fmt(a.count)} casts boosted, gives ${fmt(g.zabalLikesCount)} likes`
          : `${fmt(a.count)} casts boosted, not auto-liking yet`;
      els[id] = { ...item(name, desc), children: [`${id}b`] };
      els[`${id}b`] = !stats
        ? badge(`#${i + 1}`, 'gray')
        : g && g.zabalLikesCount > 0
          ? badge('Gives back', 'green')
          : badge('Invite', 'blue');
      rows.push(id);
    });
  }

  return {
    version: '1.0' as const,
    theme: { accent: 'amber' as const },
    ui: {
      root: 'page',
      elements: {
        page: stack('vertical', 'md', ['title', 'list', 'credit', 'nav']),
        title: text('Who the crew lifts', { weight: 'bold', size: 'md' }),
        list: stack('vertical', 'sm', rows),
        ...els,
        credit: text(CREDIT, { size: 'sm' }),
        nav: stack('horizontal', 'sm', ['back_btn', 'spark_btn', 'lb_btn']),
        back_btn: submitButton('Back', `${baseUrl}/`),
        spark_btn: submitButton('Fresh Spark', `${baseUrl}/spark`, { variant: 'primary' }),
        lb_btn: submitButton('Top givers', `${baseUrl}/leaderboard`),
      },
    },
  };
}
