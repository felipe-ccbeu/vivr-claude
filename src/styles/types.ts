/**
 * StyleConfig — centralized design system definition.
 * Enables multiple design variations (dark-bold, minimal-clean, editorial, etc.)
 * to be applied to templates without duplication.
 */

export type DesignVariation = 'dark-bold' | 'minimal-clean' | 'editorial' | 'futuristic' | 'high-contrast' | 'dark-white'

export interface VignetteConfig {
  stops: Array<{ position: string; color: string }>
  direction?: string // 'to bottom', 'to top', etc.
}

export interface BorderConfig {
  width: string
  style: string
  color: string
  radius?: string
}

export interface ShadowConfig {
  x: string
  y: string
  blur: string
  spread?: string
  color: string
}

export interface GlowConfig {
  blur: string
  spread?: string
  color: string
}

export interface PatternConfig {
  type: string // 'grid', 'gradient', 'texture', etc.
  value: string // CSS value
}

export interface TypographyStop {
  size: string // e.g., "36px"
  weight: number // 400, 500, 600, 700, 800, 900
  spacing: string // letter-spacing in px or em
  lineHeight: number // 1.0, 1.08, etc.
  textShadow?: string
  textTransform?: string // 'uppercase', 'lowercase', 'none'
}

export interface StyleConfig {
  // Metadata
  name: string // 'Dark Bold', 'Minimal Clean', etc.
  description: string
  slug: DesignVariation

  // Color Palette
  colors: {
    primary: string // Main brand color or gradient
    secondary: string // Secondary accent
    background: string // Primary background
    textPrimary: string // Headline + primary copy color
    textSecondary: string // Body copy color
    accentWord: string // Color/gradient for highlighted accent word
    ctaBg: string // CTA button background
    ctaText: string // CTA button text color
    borders?: string // Optional border color
    hooks?: string // Optional hook tag background
  }

  // Typography Specifications
  typography: {
    headline: TypographyStop
    body: TypographyStop
    cta: TypographyStop
    hook?: TypographyStop
  }

  // Visual Treatment
  visual: {
    backgroundGradient?: string
    vignette?: VignetteConfig
    borders?: BorderConfig
    shadows?: ShadowConfig[]
    glows?: GlowConfig[]
    patterns?: PatternConfig[]
    accentWordStyle: 'gradient' | 'color' | 'underline' | 'glow'
    hookTag?: {
      background: string
      border?: string
      backdropFilter?: string
    }
  }

  // CTA Button Styling
  cta: {
    borderRadius: string // e.g., "50px" for pill
    padding: string // e.g., "13px 30px"
    textTransform?: string
    boxShadow?: string
    border?: string
    minHeight?: string // e.g., "48px" for accessibility
  }

  // Safe Zone & Layout
  safeZone: {
    sidePadding: string // Horizontal margin (20px, 28px, etc.)
    topBuffer: string // Top margin (20px, 60px for story, etc.)
    bottomBuffer: string // Bottom margin (26px, 60px, etc.)
    maxContentWidth: string // Max-width for text blocks
  }
}
