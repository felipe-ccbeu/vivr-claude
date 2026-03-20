import { CampaignBrief } from '../types'

export const BRAND_GRADIENT = 'linear-gradient(135deg, #f7c948 0%, #f97040 20%, #e94899 45%, #9b5de5 65%, #26c6da 83%, #80e27e 100%)'

export const FONT_LINK = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet">`

export function highlightAccentWord(headline: string, accentWord: string): string {
  if (!accentWord) return headline
  const escaped = accentWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return headline.replace(
    new RegExp(`(${escaped})`, 'i'),
    `<span class="accent">$1</span>`
  )
}