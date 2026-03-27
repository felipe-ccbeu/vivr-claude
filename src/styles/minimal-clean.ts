import { StyleConfig } from './types'

/**
 * MINIMAL CLEAN — Distraction-Free Elegance
 *
 * White background + cyan accent, no glow effects
 * Maximizes readability and whitespace
 * Appeals to design-conscious audiences
 */
export const minimalClean: StyleConfig = {
  name: 'Minimal Clean',
  description: 'Clean white background with cyan accent, zero gradients, maximum whitespace',
  slug: 'minimal-clean',

  colors: {
    primary: '#26c6da',
    secondary: '#26c6da',
    background: '#ffffff',
    textPrimary: '#1a1a1a',
    textSecondary: '#666666',
    accentWord: '#26c6da',
    ctaBg: '#26c6da',
    ctaText: '#ffffff',
    borders: 'rgba(38,198,218,0.3)',
    hooks: 'rgba(0,0,0,0.04)',
  },

  typography: {
    headline: {
      size: '32px',
      weight: 800,
      spacing: '0px',
      lineHeight: 1.08,
    },
    body: {
      size: '13px',
      weight: 400,
      spacing: '0.1px',
      lineHeight: 1.5,
    },
    cta: {
      size: '14px',
      weight: 700,
      spacing: '0.2px',
      lineHeight: 1,
    },
    hook: {
      size: '11px',
      weight: 600,
      spacing: '0.1px',
      lineHeight: 1.3,
    },
  },

  visual: {
    vignette: {
      stops: [
        { position: '0%', color: 'rgba(0,0,0,0)' },
        { position: '100%', color: 'rgba(0,0,0,0.03)' },
      ],
      direction: 'to bottom',
    },
    borders: {
      width: '1px',
      style: 'solid',
      color: '#e0e0e0',
    },
    shadows: [
      { x: '0', y: '2px', blur: '8px', color: 'rgba(0,0,0,0.08)' },
    ],
    accentWordStyle: 'color',
    hookTag: {
      background: '#f9f9f9',
      border: '1px solid #e0e0e0',
    },
  },

  cta: {
    borderRadius: '8px',
    padding: '12px 28px',
    minHeight: '48px',
    border: '1px solid rgba(38,198,218,0.3)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },

  safeZone: {
    sidePadding: '40px',
    topBuffer: '20px',
    bottomBuffer: '26px',
    maxContentWidth: '460px',
  },
}
