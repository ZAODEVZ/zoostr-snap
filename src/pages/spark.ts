// "Fresh Spark" (desk #218 idea 3, post of the day without a token): the newest
// cast the crew boosted, one tap to open it, Next to walk back through the last 50.
// Boostr has no per-cast like count or timestamp yet, so this is "newest", not "top".
import { stack, text, item, badge, submitButton, viewCastButton, viewProfileButton } from '../components/primitives.js';
import type { BoostrStats, BoostedAuthor, BoostedCast } from '../lib/boostr.js';
import { CREDIT } from '../lib/links.js';
import { fmt, handle } from '../utils/format.js';

export function buildSparkPage(
  baseUrl: string,
  casts: BoostedCast[] | null,
  authors: BoostedAuthor[] | null,
  stats: BoostrStats | null,
  index: number,
) {
  const list = casts ?? [];
  const i = list.length ? Math.min(Math.max(0, Math.floor(index) || 0), list.length - 1) : 0;
  const cast = list[i];
  const els: Record<string, unknown> = {};
  const body: string[] = [];

  if (!cast) {
    els.empty = text('Boostr did not answer just now. Try again in a minute.', { size: 'sm' });
    body.push('empty');
  } else {
    const a = authors?.find((x) => x.fid === cast.fid);
    const g = stats?.ranked.find((x) => x.fid === cast.fid);
    const name = handle(a?.username || g?.username, cast.fid);
    const desc = a ? `${fmt(a.count)} of their casts boosted by the crew` : 'Boosted by the crew';
    els.head = { ...item(name, desc), children: ['tag'] };
    els.tag = badge(i === 0 ? 'Newest' : `${i + 1} of ${list.length}`, i === 0 ? 'green' : 'gray');
    els.hint = text('Open it and add your like or a reply.', { size: 'sm' });
    els.row = stack('horizontal', 'sm', ['open_btn', 'who_btn']);
    els.open_btn = viewCastButton('Open cast', cast.castHash, { variant: 'primary' });
    els.who_btn = viewProfileButton('Profile', cast.fid);
    body.push('head', 'hint', 'row');
  }

  const next = list.length ? (i + 1) % list.length : 0;
  return {
    version: '1.0' as const,
    theme: { accent: 'amber' as const },
    ui: {
      root: 'page',
      elements: {
        page: stack('vertical', 'md', ['title', ...body, 'credit', 'nav']),
        title: text('Fresh Spark: the newest boosted cast', { weight: 'bold', size: 'md' }),
        ...els,
        credit: text(CREDIT, { size: 'sm' }),
        nav: stack('horizontal', 'sm', ['back_btn', 'next_btn', 'lift_btn']),
        back_btn: submitButton('Back', `${baseUrl}/`),
        next_btn: submitButton('Next', `${baseUrl}/spark?i=${next}`),
        lift_btn: submitButton('Lifted', `${baseUrl}/lifted`),
      },
    },
  };
}
