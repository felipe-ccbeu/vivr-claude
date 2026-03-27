import { StyleConfig } from './types'

/**
 * DARK BOLD — Vivr Core Identity
 *
 * Vivr gradient + OLED black background
 * Premium, energetic, conversion-focused aesthetic
 * Maximum contrast with glow effects
 *
 * Proven performer — this is the default style for all existing campaigns
 */
export const darkBold: StyleConfig = {
  name: 'Dark Bold',
  description: 'Vivr core identity: gradient + OLED black, energetic and premium',
  slug: 'dark-bold',

  colors: {
    primary: 'linear-gradient(135deg, #f7c948 0%, #f97040 20%, #e94899 45%, #9b5de5 65%, #26c6da 83%, #80e27e 100%)',
    secondary: '#f97040',
    background: '#0d0d0d',
    textPrimary: '#ffffff',
    textSecondary: 'rgba(255,255,255,0.70)',
    accentWord: 'linear-gradient(135deg, #f7c948 0%, #f97040 20%, #e94899 45%, #9b5de5 65%, #26c6da 83%, #80e27e 100%)',
    ctaBg: 'linear-gradient(135deg, #f7c948 0%, #f97040 20%, #e94899 45%, #9b5de5 65%, #26c6da 83%, #80e27e 100%)',
    ctaText: '#ffffff',
    borders: 'rgba(249,112,64,0.6)',
    hooks: 'rgba(0,0,0,0.62)',
  },

  typography: {
    headline: {
      size: '36px',
      weight: 900,
      spacing: '-0.8px',
      lineHeight: 1.08,
      textShadow: '0 1px 20px rgba(0,0,0,0.8)',
    },
    body: {
      size: '14px',
      weight: 500,
      spacing: '0.1px',
      lineHeight: 1.6,
    },
    cta: {
      size: '14.5px',
      weight: 900,
      spacing: '0.3px',
      lineHeight: 1,
    },
    hook: {
      size: '11.5px',
      weight: 700,
      spacing: '0.15px',
      lineHeight: 1.35,
    },
  },

  visual: {
    vignette: {
      stops: [
        { position: '42%', color: 'rgba(0,0,0,0)' },
        { position: '72%', color: 'rgba(0,0,0,0.55)' },
        { position: '100%', color: 'rgba(13,13,13,1)' },
      ],
      direction: 'to bottom',
    },
    borders: {
      width: '1.5px',
      style: 'solid',
      color: 'transparent',
    },
    glows: [
      { blur: '0px', spread: '1px', color: 'rgba(249,112,64,0.25)' },
      { blur: '4px', spread: '0px', color: 'rgba(233,72,153,0.35)' },
      { blur: '8px', spread: '0px', color: 'rgba(233,72,153,0.35)' },
      { blur: '12px', spread: '0px', color: 'rgba(155,93,229,0.2)' },
      { blur: '32px', spread: '0px', color: 'rgba(155,93,229,0.2)' },
    ],
    accentWordStyle: 'gradient',
    hookTag: {
      background: 'rgba(0,0,0,0.62)',
      border: '1px solid rgba(255,255,255,0.18)',
      backdropFilter: 'blur(10px)',
    },
  },

  cta: {
    borderRadius: '50px',
    padding: '13px 30px',
    minHeight: '48px',
    boxShadow: `
      0 0 0 1px rgba(249,112,64,0.3),
      0 4px 16px rgba(233,72,153,0.35),
      0 8px 32px rgba(155,93,229,0.2)
    `,
  },

  safeZone: {
    sidePadding: '36px',
    topBuffer: '20px',
    bottomBuffer: '26px',
    maxContentWidth: '430px',
  },
}
