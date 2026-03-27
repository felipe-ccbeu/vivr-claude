import { StyleConfig } from './types'

/**
 * EDITORIAL — Magazine Aesthetic
 *
 * Warm off-white background, charcoal text, magenta accent
 * Serif typography for authority and sophistication
 * Perfect for thought leadership and brand positioning content
 */
export const editorial: StyleConfig = {
  name: 'Editorial',
  description: 'Magazine-style aesthetic with serif typography, charcoal and magenta, warm off-white background',
  slug: 'editorial',

  colors: {
    primary: '#e94899',
    secondary: '#2c2c2c',
    background: '#f5f3f0',
    textPrimary: '#2c2c2c',
    textSecondary: '#8a8a8a',
    accentWord: '#e94899',
    ctaBg: '#2c2c2c',
    ctaText: '#ffffff',
    borders: '#e94899',
    hooks: 'rgba(44,44,44,0.08)',
  },

  typography: {
    headline: {
      size: '34px',
      weight: 700,
      spacing: '0px',
      lineHeight: 1.2,
      textTransform: 'none',
    },
    body: {
      size: '14px',
      weight: 400,
      spacing: '0.1px',
      lineHeight: 1.65,
    },
    cta: {
      size: '13px',
      weight: 600,
      spacing: '0.3px',
      lineHeight: 1,
      textTransform: 'uppercase',
    },
    hook: {
      size: '11px',
      weight: 500,
      spacing: '0.1px',
      lineHeight: 1.3,
    },
  },

  visual: {
    vignette: {
      stops: [
        { position: '0%', color: 'rgba(0,0,0,0)' },
        { position: '100%', color: 'rgba(0,0,0,0.08)' },
      ],
      direction: 'to bottom',
    },
    borders: {
      width: '3px',
      style: 'solid',
      color: '#e94899',
    },
    shadows: [
      { x: '0', y: '1px', blur: '4px', color: 'rgba(0,0,0,0.1)' },
    ],
    accentWordStyle: 'color',
    hookTag: {
      background: '#ffffff',
      border: '1px solid #e94899',
    },
  },

  cta: {
    borderRadius: '8px',
    padding: '12px 28px',
    minHeight: '48px',
    textTransform: 'uppercase',
    boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
  },

  safeZone: {
    sidePadding: '32px',
    topBuffer: '20px',
    bottomBuffer: '26px',
    maxContentWidth: '445px',
  },
}
