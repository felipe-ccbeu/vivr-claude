import { StyleConfig } from './types'

/**
 * DARK & WHITE — Elegant Monochromatic Simplicity
 *
 * Pure black and white with minimal gray accents
 * Timeless, understated, premium positioning
 * Perfect for sophisticated brand messaging
 */
export const darkWhite: StyleConfig = {
  name: 'Dark & White',
  description: 'Timeless monochromatic elegance: pure black/white with minimal gray accents',
  slug: 'dark-white',

  colors: {
    primary: '#000000',
    secondary: '#4a4a4a',
    background: '#ffffff',
    textPrimary: '#000000',
    textSecondary: '#4a4a4a',
    accentWord: '#000000',
    ctaBg: '#000000',
    ctaText: '#ffffff',
    borders: '#e0e0e0',
    hooks: '#f5f5f5',
  },

  typography: {
    headline: {
      size: '35px',
      weight: 700,
      spacing: '-0.5px',
      lineHeight: 1.1,
      textTransform: 'none',
    },
    body: {
      size: '14px',
      weight: 400,
      spacing: '0.1px',
      lineHeight: 1.6,
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
        { position: '100%', color: 'rgba(0,0,0,0.04)' },
      ],
      direction: 'to bottom',
    },
    borders: {
      width: '1px',
      style: 'solid',
      color: '#e0e0e0',
    },
    shadows: [
      { x: '0', y: '1px', blur: '4px', color: 'rgba(0,0,0,0.1)' },
    ],
    accentWordStyle: 'color',
    hookTag: {
      background: '#f5f5f5',
      border: '1px solid #e0e0e0',
    },
  },

  cta: {
    borderRadius: '6px',
    padding: '12px 28px',
    minHeight: '48px',
    border: '1px solid #000000',
    boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
  },

  safeZone: {
    sidePadding: '32px',
    topBuffer: '20px',
    bottomBuffer: '26px',
    maxContentWidth: '445px',
  },
}
