import {
  stack, text, input,
  submitButton, openUrlButton,
  themes,
} from '../components/primitives.js';

// Input page. Demonstrates: typed input field, primary submit button to a route
// that consumes ctx.action.inputs?.name in src/app.ts.

export function buildFormPage(baseUrl: string) {
  return {
    version: '1.0' as const,
    theme: themes.zlank,
    ui: {
      root: 'page',
      elements: {
        page: stack('vertical', 'md', ['title', 'desc', 'name_input', 'btn_row']),

        title: text('Say Hello', { weight: 'bold' }),
        desc: text('Type your name. Submit posts back to /result with your input. The handler reads ctx.action.inputs.name and renders a personalized page.', { size: 'sm' }),

        name_input: input('name', 'Your name', 'satoshi'),

        btn_row: stack('horizontal', 'sm', ['submit_btn', 'back_btn']),
        submit_btn: submitButton('Submit', `${baseUrl}/result`, { variant: 'primary' }),
        back_btn: openUrlButton('Back to Home', `${baseUrl}/`, 'arrow-left'),
      },
    },
  };
}
