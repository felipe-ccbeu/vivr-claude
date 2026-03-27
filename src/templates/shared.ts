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