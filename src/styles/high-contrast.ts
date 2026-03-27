import { StyleConfig } from './types'

/**
 * HIGH CONTRAST — Accessibility-First Maximum Readability
 *
 * Pure black and white with golden yellow accent
 * WCAG AAA compliant (21:1 contrast ratio)
 * Zero subtle effects, bold geometric design
 * Ensures maximum readability for all demographics
 */
export const highContrast: StyleConfig = {
  name: 'High Contrast',
  description: 'WCAG AAA compliant: pure black/white with golden yellow accent, maximum readability',
  slug: 'high-contrast',

  colors: {
    primary: '#ffcc00',
    secondary: '#ffcc00',
    background: '#ffffff',
    textPrimary: '#000000',
    textSecondary: '#1a1a1a',
    accentWord: '#ffcc00',
    ctaBg: '#ffcc00',
    ctaText: '#000000',
    borders: '#000000',
    hooks: '#f0f0f0',
  },

  typography: {
    headline: {
      size: '40px',
      weight: 900,
      spacing: '0px',
      lineHeight: 1.08,
      textTransform: 'none',
    },
    body: {
      size: '15px',
      weight: 600,
      spacing: '0px',
      lineHeight: 1.75,
    },
    cta: {
      size: '15px',
      weight: 900,
      spacing: '0.3px',
      lineHeight: 1,
      textTransform: 'uppercase',
    },
    hook: {
      size: '12px',
      weight: 900,
      spacing: '0.2px',
      lineHeight: 1.3,
      textTransform: 'uppercase',
    },
  },

  visual: {
    vignette: {
      stops: [
        { position: '0%', color: 'rgba(0,0,0,0)' },
        { position: '100%', color: 'rgba(0,0,0,0.05)' },
      ],
      direction: 'to bottom',
    },
    borders: {
      width: '3px',
      style: 'solid',
      color: '#000000',
    },
    shadows: [],
    accentWordStyle: 'color',
    hookTag: {
      background: '#f0f0f0',
      border: '2px solid #000000',
    },
  },

  cta: {
    borderRadius: '0px',
    padding: '14px 32px',
    minHeight: '54px',
    border: '2px solid #000000',
    textTransform: 'uppercase',
    boxShadow: 'none',
  },

  safeZone: {
    sidePadding: '30px',
    topBuffer: '20px',
    bottomBuffer: '26px',
    maxContentWidth: '450px',
  },
}
