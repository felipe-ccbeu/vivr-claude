import { CopyVariant } from '../content-schema'
import { StyleConfig } from '../styles'
import { FONT_LINK, BADGE_GRADIENT, highlightAccentWord, STORY_HEIGHT, STORY_SAFE_BOTTOM } from './shared'

/**
 * SPLIT-REVERSE — Layout Horizontal (540×675px)
 * Imagem à esquerda (240px), texto à direita em layout horizontal.
 * Dark/light via isLight flag. Para fundo gradiente use split-reverse-gradient.
 */
export function buildSplitReverse(variant: CopyVariant, imageSrc: string, styleConfig: StyleConfig, isStory = false): string {
  const headlineHtml = highlightAccentWord(variant.headline, variant.accentWord)
  const isLight = styleConfig.colors.background === '#ffffff'
  const H = isStory ? STORY_HEIGHT : 675
  const imgW = isStory ? 280 : 240
  const headlineSz = isStory ? 34 : 28
  const textPadBottom = isStory ? STORY_SAFE_BOTTOM : 28

  const bodyBg       = isLight ? '#ffffff' : '#1A1030'
  const vignetteColor = isLight
    ? 'linear-gradient(to bottom, rgba(255,255,255,0) 50%, rgba(255,255,255,0.3) 85%, rgba(255,255,255,0.6) 100%)'
    : 'linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.4) 85%, rgba(13,13,13,0.8) 100%)'
  const hookColor    = isLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.6)'
  const headlineColor = isLight ? '#1a1030' : '#ffffff'
  const bodyColor    = isLight ? 'rgba(26,16,48,0.55)' : 'rgba(255,255,255,0.65)'
  const ctaShadow    = isLight ? '0 4px 16px rgba(233,72,153,0.25)' : '0 4px 16px rgba(233,72,153,0.3)'

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
${FONT_LINK}
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { width: 540px; height: ${H}px; overflow: hidden; font-family: 'Nunito', sans-serif; background: ${bodyBg}; }
  .post-wrapper { width: 540px; height: ${H}px; display: flex; flex-direction: row; overflow: hidden; }
  .image-section { width: ${imgW}px; height: ${H}px; flex-shrink: 0; position: relative; overflow: hidden; }
  .image-section img { width: 100%; height: 100%; object-fit: cover; object-position: center 30%; display: block; }
  .image-vignette { position: absolute; inset: 0; background: ${vignetteColor}; pointer-events: none; }
  .text-section { flex: 1; background: ${bodyBg}; padding: 28px 24px ${textPadBottom}px; display: flex; flex-direction: column; justify-content: space-between; position: relative; }
  .text-section::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 2px; background: ${BADGE_GRADIENT}; }
  .hook-tag { font-size: 11px; font-weight: 700; color: ${hookColor}; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 8px; }
  .headline { font-size: ${headlineSz}px; font-weight: 900; color: ${headlineColor}; line-height: 1.1; letter-spacing: -0.8px; margin-bottom: 10px; }
  .accent { background: ${BADGE_GRADIENT}; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .body-copy { font-size: 13px; font-weight: 500; color: ${bodyColor}; line-height: 1.5; margin-bottom: 16px; letter-spacing: 0.1px; }
  .cta-btn { display: inline-flex; align-items: center; padding: 13px 28px; border-radius: 100px; font-size: 14px; font-weight: 800; color: white; background: ${BADGE_GRADIENT}; letter-spacing: 0.3px; white-space: nowrap; align-self: flex-start; box-shadow: ${ctaShadow}; }
</style>
</head>
<body>
<div class="post-wrapper">
  <div class="image-section">
    <img src="${imageSrc}" alt="" />
    <div class="image-vignette"></div>
  </div>
  <div class="text-section">
    <div>
      <div class="hook-tag" data-slot="hook">${variant.hook}</div>
      <div class="headline" data-slot="headline">${headlineHtml}</div>
      <div class="body-copy" data-slot="body">${variant.body}</div>
    </div>
    <div class="cta-btn" data-slot="cta">${variant.cta}</div>
  </div>
</div>
</body>
</html>`
}
