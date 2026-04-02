import { CopyVariant } from '../content-schema'
import { StyleConfig } from '../styles'
import { FONT_LINK, BADGE_GRADIENT, highlightAccentWord, STORY_HEIGHT, STORY_SAFE_TOP, STORY_SAFE_BOTTOM } from './shared'

/**
 * CINEMATIC — imagem ocupa 100% do frame (540×675px).
 * Texto em dois pontos fixos: hook no topo, headline+CTA na base.
 * Sem painel separado, sem letterbox. Overlay ultra-suave — a imagem faz o trabalho.
 */
export function buildCinematic(variant: CopyVariant, imageSrc: string, _styleConfig: StyleConfig, isStory = false): string {
  const headlineHtml = highlightAccentWord(variant.headline, variant.accentWord)
  const hookLine = variant.hook.split(/[.!?]/)[0].trim()
  const H = isStory ? STORY_HEIGHT : 675
  const hookTop = isStory ? STORY_SAFE_TOP : 24
  const baseBottom = isStory ? STORY_SAFE_BOTTOM : 36
  const headlineSz = isStory ? 52 : 46

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
${FONT_LINK}
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    width: 540px;
    height: ${H}px;
    overflow: hidden;
    font-family: 'Nunito', sans-serif;
    background: #000;
  }

  .post-wrapper {
    position: relative;
    width: 540px;
    height: ${H}px;
    overflow: hidden;
  }

  .bg-img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 25%;
    display: block;
  }

  .overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      transparent 0%,
      transparent 55%,
      rgba(0,0,0,0.10) 62%,
      rgba(0,0,0,0.50) 80%,
      rgba(0,0,0,0.65) 100%
    );
    z-index: 2;
  }

  .overlay-top {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 160px;
    background: linear-gradient(to bottom, rgba(0,0,0,0.52) 0%, transparent 100%);
    z-index: 2;
  }

  .hook-line {
    position: absolute;
    top: ${hookTop}px;
    left: 28px;
    right: 28px;
    font-size: 11px;
    font-weight: 700;
    color: rgba(255,255,255,0.72);
    letter-spacing: 0.18em;
    text-transform: uppercase;
    z-index: 20;
    padding-left: 10px;
    border-left: 2px solid rgba(249,112,64,0.8);
  }

  .base-content {
    position: absolute;
    bottom: ${baseBottom}px;
    left: 28px;
    right: 28px;
    z-index: 20;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .headline {
    font-size: ${headlineSz}px;
    font-weight: 900;
    color: #ffffff;
    line-height: 1.0;
    letter-spacing: -0.04em;
    text-shadow: 0 2px 24px rgba(0,0,0,0.55);
  }

  .accent {
    background: ${BADGE_GRADIENT};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: none;
  }

  .cta-row {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-top: 8px;
  }

  .cta-btn {
    display: inline-flex;
    align-items: center;
    padding: 13px 28px;
    border-radius: 100px;
    font-size: 14px;
    font-weight: 800;
    color: white;
    background: ${BADGE_GRADIENT};
    letter-spacing: 0.2px;
    white-space: nowrap;
    box-shadow:
      0 0 0 1px rgba(249,112,64,0.3),
      0 4px 16px rgba(233,72,153,0.35),
      0 8px 32px rgba(155,93,229,0.2);
  }

  .sub-label {
    font-size: 11px;
    font-weight: 600;
    color: rgba(255,255,255,0.42);
    letter-spacing: 0.04em;
  }
</style>
</head>
<body>
<div class="post-wrapper">

  <img class="bg-img" src="${imageSrc}" alt="" />

  <div class="overlay-top"></div>
  <div class="overlay"></div>

  <div class="hook-line" data-slot="hook">${hookLine}</div>

  <div class="base-content">
    <div class="headline" data-slot="headline">${headlineHtml}</div>
    <div class="cta-row">
      <div class="cta-btn" data-slot="cta">${variant.cta}</div>
      <span class="sub-label">É grátis</span>
    </div>
  </div>

</div>
</body>
</html>`
}