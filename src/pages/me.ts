import { stack, text, item, badge, submitButton, openUrlButton, shareCastButton } from '../components/primitives.js';
import type { BoostrStats } from '../lib/boostr.js';
import { LINKS } from '../lib/links.js';
import { fmt, sanitizeInput } from '../utils/format.js';

export function buildMePage(baseUrl: string, stats: BoostrStats | null, fid: number | null) {
  const me = fid != null ? stats?.ranked.find((c) => c.fid === fid) : undefined;
  const total = stats?.ranked.length ?? 0;

  const head = me
    ? { ...item(`@${sanitizeInput(me.username || `fid ${me.fid}`, 24)}`, `Rank #${me.rank} of ${fmt(total)}`), children: ['tag'] }
    : { ...item('Not on the board yet', 'Boost a ZABAL cast to get your first points'), children: ['tag'] };
  const tag = me ? badge(`${fmt(me.zabalLikesCount)} boosts`, 'amber') : badge('New', 'gray');
  const note = text(
    stats ? 'Points come from boosting ZABAL casts through Boostr.' : 'Boostr did not answer just now. Try again in a minute.',
    { size: 'sm' },
  );
  const share = me
    ? shareCastButton('Share rank', `I am #${me.rank} on the Zoostr board with ${me.zabalLikesCount} boosts`, [baseUrl])
    : openUrlButton('How it works', LINKS.site);

  return {
    version: '1.0' as const,
    theme: { accent: 'amber' as const },
    ui: {
      root: 'page',
      elements: {
        page: stack('vertical', 'md', ['head', 'note', 'nav']),
        head,
        tag,
        note,
        nav: stack('horizontal', 'sm', ['back_btn', 'lb_btn', 'share_btn']),
        back_btn: submitButton('Back', `${baseUrl}/`),
        lb_btn: submitButton('Leaderboard', `${baseUrl}/leaderboard`, { variant: 'primary' }),
        share_btn: share,
      },
    },
  };
}
