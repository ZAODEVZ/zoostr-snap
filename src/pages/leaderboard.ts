import { stack, text, item, badge, submitButton, openUrlButton } from '../components/primitives.js';
import type { BoostrStats } from '../lib/boostr.js';
import { LINKS } from '../lib/links.js';
import { fmt, sanitizeInput } from '../utils/format.js';

const TOP = 5;

export function buildLeaderboardPage(baseUrl: string, stats: BoostrStats | null) {
  const top = stats?.ranked.slice(0, TOP) ?? [];
  const rowEls: Record<string, ReturnType<typeof item> | ReturnType<typeof badge> | ReturnType<typeof text>> = {};
  const rows: string[] = [];

  if (top.length === 0) {
    rowEls.empty = text('Boostr did not answer just now. Try again in a minute.', { size: 'sm' });
    rows.push('empty');
  } else {
    top.forEach((c, i) => {
      const id = `r${i}`;
      const name = sanitizeInput(c.username || `fid ${c.fid}`, 24);
      rowEls[id] = { ...item(`#${c.rank} @${name}`, `${fmt(c.zabalLikesCount)} boosts`), children: [`${id}b`] };
      rowEls[`${id}b`] = badge(i === 0 ? 'Top' : `#${c.rank}`, i === 0 ? 'amber' : 'gray');
      rows.push(id);
    });
  }

  return {
    version: '1.0' as const,
    theme: { accent: 'amber' as const },
    ui: {
      root: 'page',
      elements: {
        page: stack('vertical', 'md', ['title', 'list', 'nav']),
        title: text('Zoostr top boosters', { weight: 'bold', size: 'md' }),
        list: stack('vertical', 'sm', rows),
        ...rowEls,
        nav: stack('horizontal', 'sm', ['back_btn', 'me_btn', 'full_btn']),
        back_btn: submitButton('Back', `${baseUrl}/`),
        me_btn: submitButton('My rank', `${baseUrl}/me`, { variant: 'primary' }),
        full_btn: openUrlButton('Full board', LINKS.leaderboard),
      },
    },
  };
}
