import { CopyVariant } from '../content-schema'
import { StyleConfig } from '../styles'
import { FONT_LINK, BADGE_GRADIENT, highlightAccentWord, STORY_HEIGHT, STORY_SAFE_BOTTOM } from './shared'

/**
 * SPLIT-REVERSE-GRADIENT — Layout Horizontal (540×675px)
 * Fundo BADGE_GRADIENT vibrante. Imagem à esquerda com padding+border-radius.
 * Painel de texto dark glass à direita. Accent branco itálico. CTA botão branco.
 */
export function buildSplitReverseGradient(variant: CopyVariant, imageSrc: string, _styleConfig: StyleConfig, isStory = false): string {
  const headlineHtml = highlightAccentWord(variant.headline, variant.accentWord)
  const H = isStory ? STORY_HEIGHT : 675
  const imgW = isStory ? 280 : 240
  const headlineSz = isStory ? 34 : 28
  const textPadBottom = isStory ? STORY_SAFE_BOTTOM : 28

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
${FONT_LINK}
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { width: 540px; height: ${H}px; overflow: hidden; font-family: 'Nunito', sans-serif; }
  .post-wrapper { width: 540px; height: ${H}px; display: flex; flex-direction: row; overflow: hidden; background: ${BADGE_GRADIENT}; }
  .image-section { width: ${imgW}px; height: ${H}px; flex-shrink: 0; position: relative; overflow: hidden; padding: 12px; }
  .img-inner { width: 100%; height: 100%; border-radius: 20px; overflow: hidden; position: relative; }
  .image-section img { width: 100%; height: 100%; object-fit: cover; object-position: center 30%; display: block; }
  .text-section { flex: 1; background: rgba(10,6,24,0.82); backdrop-filter: blur(12px); margin: 12px 12px 12px 0; border-radius: 20px; padding: 28px 24px ${textPadBottom}px; display: flex; flex-direction: column; justify-content: space-between; position: relative; }
  .hook-tag { font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.55); text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 8px; }
  .headline { font-size: ${headlineSz}px; font-weight: 900; color: #ffffff; line-height: 1.1; letter-spacing: -0.8px; margin-bottom: 10px; }
  .accent { font-style: italic; color: #ffffff; }
  .body-copy { font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.65); line-height: 1.5; margin-bottom: 16px; letter-spacing: 0.1px; }
  .cta-btn { display: inline-flex; align-items: center; padding: 13px 28px; border-radius: 100px; font-size: 14px; font-weight: 800; color: #1a1030; background: #ffffff; letter-spacing: 0.3px; white-space: nowrap; align-self: flex-start; box-shadow: 0 4px 16px rgba(0,0,0,0.2); }
</style>
</head>
<body>
<div class="post-wrapper">
  <div class="image-section">
    <div class="img-inner">
      <img src="${imageSrc}" alt="" />
    </div>
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
