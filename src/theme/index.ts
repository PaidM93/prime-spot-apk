// src/theme/index.ts
export const Colors = {
  cyan:    '#00f5d4',
  violet:  '#9d6fff',
  pink:    '#ff6eb4',
  gold:    '#ffd60a',
  green:   '#00e676',
  red:     '#ff4d6d',

  dark: {
    bg0:         '#04040f',
    bg1:         '#08081a',
    bg2:         '#0e0e24',
    card:        'rgba(255,255,255,0.05)',
    border:      'rgba(255,255,255,0.09)',
    text:        '#f1f5f9',
    textSub:     '#94a3b8',
    textMuted:   '#475569',
    tabBar:      '#08081a',
    tabBorder:   'rgba(157,111,255,0.25)',
    inputBg:     'rgba(255,255,255,0.06)',
    shimmer1:    '#0e0e24',
    shimmer2:    '#14143a',
  },
  light: {
    bg0:         '#f0f4f8',
    bg1:         '#e2e8f0',
    bg2:         '#cbd5e1',
    card:        'rgba(0,0,0,0.04)',
    border:      'rgba(0,0,0,0.10)',
    text:        '#0f172a',
    textSub:     '#334155',
    textMuted:   '#64748b',
    tabBar:      '#ffffff',
    tabBorder:   'rgba(124,58,237,0.2)',
    inputBg:     'rgba(0,0,0,0.06)',
    shimmer1:    '#e2e8f0',
    shimmer2:    '#f8fafc',
  },
};

export type ThemeMode = 'dark' | 'light';

export function getTheme(mode: ThemeMode) {
  return mode === 'dark' ? Colors.dark : Colors.light;
}
