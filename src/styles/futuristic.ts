import { StyleConfig } from './types'

/**
 * FUTURISTIC — Tech-Forward Innovation Aesthetic
 *
 * Deep navy background with neon cyan/magenta
 * High-energy glow effects and neon colors
 * Appeals to early adopters and technology-forward audiences
 */
export const futuristic: StyleConfig = {
  name: 'Futuristic',
  description: 'Neon cyan/magenta on deep navy, high-energy glow effects, tech-forward aesthetic',
  slug: 'futuristic',

  colors: {
    primary: '#00d9ff',
    secondary: '#a000ff',
    background: '#0a0e27',
    textPrimary: '#e0e0ff',
    textSecondary: '#7d9fff',
    accentWord: '#00d9ff',
    ctaBg: '#00d9ff',
    ctaText: '#0a0e27',
    borders: '#00d9ff',
    hooks: 'rgba(0,217,255,0.15)',
  },

  typography: {
    headline: {
      size: '38px',
      weight: 900,
      spacing: '0.5px',
      lineHeight: 1.08,
      textTransform: 'uppercase',
      textShadow: '0 0 12px #00d9ff, 0 0 24px #a000ff',
    },
    body: {
      size: '13px',
      weight: 400,
      spacing: '0.15px',
      lineHeight: 1.55,
    },
    cta: {
      size: '13px',
      weight: 800,
      spacing: '0.4px',
      lineHeight: 1,
      textTransform: 'uppercase',
    },
    hook: {
      size: '11px',
      weight: 700,
      spacing: '0.2px',
      lineHeight: 1.3,
      textTransform: 'uppercase',
    },
  },

  visual: {
    vignette: {
      stops: [
        { position: '0%', color: 'rgba(0,0,0,0)' },
        { position: '100%', color: 'rgba(0,0,0,0.4)' },
      ],
      direction: 'to bottom',
    },
    borders: {
      width: '1px',
      style: 'solid',
      color: '#00d9ff',
    },
    glows: [
      { blur: '12px', color: '#00d9ff' },
      { blur: '24px', color: '#a000ff' },
    ],
    accentWordStyle: 'glow',
    hookTag: {
      background: 'rgba(0,217,255,0.1)',
      border: '1px solid #00d9ff',
      backdropFilter: 'blur(8px)',
    },
  },

  cta: {
    borderRadius: '4px',
    padding: '12px 28px',
    minHeight: '48px',
    border: '1px solid #00d9ff',
    boxShadow: `
      0 0 12px #00d9ff,
      0 0 24px #a000ff,
      inset 0 0 8px rgba(0,217,255,0.2)
    `,
  },

  safeZone: {
    sidePadding: '36px',
    topBuffer: '20px',
    bottomBuffer: '26px',
    maxContentWidth: '430px',
  },
}
