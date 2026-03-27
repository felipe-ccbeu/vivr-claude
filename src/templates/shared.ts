export const BRAND_GRADIENT = 'linear-gradient(135deg, #f7c948 0%, #f97040 20%, #e94899 45%, #9b5de5 65%, #26c6da 83%, #80e27e 100%)'

export const FONT_LINK = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet">`

/** Palavras funcionais do português que não devem ser accentuadas */
const SKIP_PT = new Set([
  'o','a','os','as','um','uma','uns','umas',
  'de','da','do','das','dos','em','na','no','nas','nos',
  'para','pro','pra','pros','pras','por','com','sem','sob','sobre',
  'que','se','mas','e','ou','nem','pois','porque','quando','onde',
  'já','não','vai','ser','ter','ir','é','são','foi','era',
  'isso','isto','aqui','lá','você','ele','ela','seu','sua',
  'antes','depois','ainda','como','mais','menos',
])

/**
 * Auto-detecta a palavra de destaque do headline.
 * Prioriza: último substantivo/verbo forte ignorando palavras funcionais.
 * Fallback: última palavra.
 */
export function autoAccentWord(headline: string): string {
  const words = headline
    .replace(/[.,!?]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 2 && !SKIP_PT.has(w.toLowerCase()))

  // Prefere palavras mais longas (mais semânticas) no final do headline
  const candidates = words.filter(w => w.length >= 4)
  if (candidates.length > 0) return candidates[candidates.length - 1]

  // Fallback: qualquer palavra não-funcional
  if (words.length > 0) return words[words.length - 1]

  // Último recurso: última palavra do headline
  const all = headline.replace(/[.,!?]/g, '').split(/\s+/)
  return all[all.length - 1] ?? ''
}

export function highlightAccentWord(headline: string, accentWord?: string): string {
  const word = accentWord || autoAccentWord(headline)
  if (!word) return headline
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return headline.replace(
    new RegExp(`(${escaped})`, 'i'),
    `<span class="accent">$1</span>`
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   CSS BUILDER FUNCTIONS — Componentes reutilizáveis entre templates
   Extraídos de light-arc.ts, cinematic.ts, split.ts, etc.
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

import { StyleConfig } from '../styles'

/**
 * CSS reset + body + .post-wrapper — estrutura base de todos os templates.
 * width/height são as dimensões do canvas (540×675 feed, 540×960 story).
 * background é a cor de fundo do body (varia por template: #000 cinematic, #f5f4f0 light-arc).
 */
export function buildBaseCSS(width: number, height: number, background?: string): string {
  return `* { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    width: ${width}px;
    height: ${height}px;
    overflow: hidden;
    font-family: 'Nunito', sans-serif;
    background: ${background || '#000'};
  }

  .post-wrapper {
    position: relative;
    width: ${width}px;
    height: ${height}px;
    overflow: hidden;
  }`
}

/**
 * .accent { background-clip: text } — padrão de gradient clip para highlight de palavra.
 * gradient deve vir de styleConfig.colors.accentWord.
 * extraStyles permite adicionar propriedades extras (ex: cinematic adiciona filter: drop-shadow).
 */
export function buildAccentCSS(gradient: string, extraStyles?: string): string {
  return `.accent {
    background: ${gradient};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    ${extraStyles || ''}
  }`
}

/**
 * .cta-btn pill button — usado em todos os templates.
 * Lê styleConfig.colors.ctaBg, styleConfig.cta.* para dimensionamento.
 * paddingOverride permite light-arc (13px 26px) vs cinematic (11px 24px) usar valores diferentes.
 * suppressShadow=true remove box-shadow (cinematic é "flat e direto").
 */
export function buildCTABtnCSS(
  styleConfig: StyleConfig,
  paddingOverride?: string,
  suppressShadow?: boolean
): string {
  const padding = paddingOverride || styleConfig.cta.padding || '14px 30px'
  const shadow = suppressShadow ? '' : (styleConfig.cta.boxShadow || '')

  return `.cta-btn {
    display: inline-flex;
    align-items: center;
    padding: ${padding};
    border-radius: ${styleConfig.cta.borderRadius || '100px'};
    font-size: 14px;
    font-weight: 800;
    color: ${styleConfig.colors.ctaText || 'white'};
    background: ${styleConfig.colors.ctaBg};
    letter-spacing: 0.02em;
    white-space: nowrap;
    ${shadow ? `box-shadow: ${shadow};` : ''}
  }`
}

/**
 * .hook-pill frosted glass — aparece em light-arc, split, story como pill de contexto.
 * colorOverride permite light-arc usar background branco (rgba(255,255,255,0.88))
 * vs versões escuras que usam rgba(0,0,0,...).
 */
export function buildHookPillCSS(styleConfig: StyleConfig, colorOverride?: string): string {
  const bgColor = colorOverride || 'rgba(255,255,255,0.88)'
  const textColor = colorOverride && colorOverride.includes('255') ? '#0d0d0d' : '#1a1a1a'

  return `.hook-pill {
    position: absolute;
    top: 24px;
    left: 24px;
    background: ${bgColor};
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-radius: 100px;
    padding: 8px 16px;
    font-size: 11px;
    font-weight: 700;
    color: ${textColor};
    letter-spacing: 0.05em;
    max-width: 280px;
    line-height: 1.3;
    z-index: 10;
    box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  }`
}

/**
 * .badge-free "Grátis" badge — canto superior direito, presente em 5/8 templates.
 * Usa styleConfig.colors.primary para background (o gradiente de marca).
 */
export function buildBadgeFreeCSS(styleConfig: StyleConfig): string {
  return `.badge-free {
    position: absolute;
    top: 24px;
    right: 24px;
    background: ${styleConfig.colors.primary};
    border-radius: 100px;
    padding: 8px 18px;
    font-size: 11px;
    font-weight: 800;
    color: white;
    letter-spacing: 0.04em;
    z-index: 10;
    box-shadow: 0 4px 16px rgba(233, 72, 153, 0.28);
  }`
}

/**
 * .cta-row { display: flex } — layout horizontal CTA + sub-label.
 * Usado em light-arc, cinematic, overlay, phone-float para alinhar botão + texto ao lado.
 * gap default: 14px. marginTop default: 6px.
 */
export function buildCTARowCSS(gap?: string, marginTop?: string): string {
  return `.cta-row {
    display: flex;
    align-items: center;
    gap: ${gap || '14px'};
    margin-top: ${marginTop || '6px'};
  }`
}