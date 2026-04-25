import {
  stack, text, item, badge, separator,
  submitButton, shareCastButton,
  themes,
} from '../components/primitives.js';

// Result page. Demonstrates: rendering content from posted input, conditional badge,
// share-back-to-feed button with personalized text + embed.

export function buildResultPage(baseUrl: string, name: string) {
  const isAnon = name === 'anon' || !name;
  return {
    version: '1.0' as const,
    theme: themes.zlank,
    ui: {
      root: 'page',
      elements: {
        page: stack('vertical', 'md', ['greeting', 'sub', 'div1', 'tip', 'btn_row']),

        greeting: { ...item(`Hello, ${name}`, isAnon ? 'No name received - try again with input' : 'You hit a Snap with form input'), children: ['greeting_badge'] },
        greeting_badge: badge(isAnon ? 'anon' : 'received', isAnon ? 'gray' : 'green'),

        sub: text(`This page received ctx.action.inputs.name = "${name}".`, { size: 'sm' }),

        div1: separator(),

        tip: text('Try wiring this to: a Supabase query, a contract read, a price feed, a Farcaster user lookup. Each becomes its own route in src/app.ts.', { size: 'sm' }),

        btn_row: stack('horizontal', 'sm', ['again_btn', 'share_btn']),
        again_btn: submitButton('Try Again', `${baseUrl}/form`, { variant: 'primary', icon: 'refresh-cw' }),
        share_btn: shareCastButton(
          'Share',
          `Tried Zlank Snap template - hello ${name}`,
          [baseUrl],
        ),
      },
    },
  };
}
