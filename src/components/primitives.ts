// Reusable element factories. Cuts repetition when assembling pages.
// Each returns a typed element node ready to drop into ui.elements.

type Accent = 'purple' | 'red' | 'green' | 'amber' | 'gray' | 'blue';
type BadgeColor = 'green' | 'red' | 'amber' | 'gray' | 'purple' | 'blue';
type Variant = 'primary' | 'secondary';
type Direction = 'horizontal' | 'vertical';
type Gap = 'sm' | 'md' | 'lg';

export function stack(direction: Direction, gap: Gap, children: string[]) {
  return {
    type: 'stack' as const,
    props: { direction, gap },
    children,
  };
}

export function text(content: string, opts: { weight?: 'bold' | 'regular'; size?: 'sm' | 'md' | 'lg' } = {}) {
  return {
    type: 'text' as const,
    props: { content, ...opts },
  };
}

export function item(title: string, description: string, children: string[] = []) {
  return {
    type: 'item' as const,
    props: { title, description },
    children,
  };
}

export function badge(label: string, color: BadgeColor) {
  return {
    type: 'badge' as const,
    props: { label, color },
  };
}

export function separator() {
  return { type: 'separator' as const, props: {} };
}

export function input(name: string, label: string, placeholder: string, type: 'text' | 'number' = 'text') {
  return {
    type: 'input' as const,
    props: { name, type, label, placeholder },
  };
}

export function submitButton(label: string, target: string, opts: { variant?: Variant; icon?: string } = {}) {
  return {
    type: 'button' as const,
    props: { label, ...(opts.variant && { variant: opts.variant }), ...(opts.icon && { icon: opts.icon }) },
    on: {
      press: {
        action: 'submit' as const,
        params: { target },
      },
    },
  };
}

export function openUrlButton(label: string, target: string, icon: string = 'external-link') {
  return {
    type: 'button' as const,
    props: { label, icon },
    on: {
      press: {
        action: 'open_url' as const,
        params: { target },
      },
    },
  };
}

export function openMiniAppButton(label: string, target: string, opts: { variant?: Variant; icon?: string } = {}) {
  return {
    type: 'button' as const,
    props: { label, ...(opts.variant && { variant: opts.variant }), ...(opts.icon && { icon: opts.icon }) },
    on: {
      press: {
        action: 'open_mini_app' as const,
        params: { target },
      },
    },
  };
}

export function viewProfileButton(label: string, fid: number) {
  return {
    type: 'button' as const,
    props: { label, icon: 'user' },
    on: {
      press: {
        action: 'view_profile' as const,
        params: { fid },
      },
    },
  };
}

export function shareCastButton(label: string, text: string, embeds: string[]) {
  return {
    type: 'button' as const,
    props: { label, icon: 'share' },
    on: {
      press: {
        action: 'compose_cast' as const,
        params: { text, embeds },
      },
    },
  };
}

export function image(url: string, alt: string, aspect: '1:1' | '16:9' | '4:3' = '1:1') {
  return {
    type: 'image' as const,
    props: { url, aspect, alt },
  };
}

export function progress(value: number, max: number, label: string) {
  return {
    type: 'progress' as const,
    props: { value, max, label },
  };
}

// Theme presets - extend as you add brand palettes
export const themes = {
  zlank: { accent: 'purple' as Accent },
  zao: { accent: 'amber' as Accent },
  default: { accent: 'blue' as Accent },
};

export function viewCastButton(label: string, hash: string, opts: { variant?: Variant } = {}) {
  return {
    type: 'button' as const,
    props: { label, icon: 'message-circle', ...(opts.variant && { variant: opts.variant }) },
    on: {
      press: {
        action: 'view_cast' as const,
        params: { hash },
      },
    },
  };
}
