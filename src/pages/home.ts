import {
  stack, text, item, badge, separator,
  submitButton, openUrlButton, shareCastButton,
  themes,
} from '../components/primitives.js';

// Landing page. Demonstrates: themed accent, header item with badge, info text,
// button rows (submit / open_url / share_cast), and a separator divider.

export function buildHomePage(baseUrl: string) {
  return {
    version: '1.0' as const,
    theme: themes.zlank,
    ui: {
      root: 'page',
      elements: {
        page: stack('vertical', 'md', ['header', 'desc', 'div1', 'btn_row_1', 'btn_row_2']),

        header: { ...item('Zlank Snap Template', 'Starter for Farcaster Snaps'), children: ['header_badge'] },
        header_badge: badge('v0.1', 'green'),

        desc: text('Tap a button to navigate. Each route in src/pages/ renders a Snap page. Wire your own data + actions in src/app.ts.', { size: 'sm' }),

        div1: separator(),

        btn_row_1: stack('horizontal', 'sm', ['form_btn', 'docs_btn']),
        form_btn: submitButton('Try Form Page', `${baseUrl}/form`, { variant: 'primary' }),
        docs_btn: openUrlButton('Snap Docs', 'https://docs.farcaster.xyz/snap'),

        btn_row_2: stack('horizontal', 'sm', ['source_btn', 'share_btn']),
        source_btn: openUrlButton('Source', 'https://github.com/zlank-labs/zlank-snap-template', 'code'),
        share_btn: shareCastButton(
          'Share',
          'Check out this Farcaster Snap built with the Zlank template',
          [baseUrl],
        ),
      },
    },
  };
}
