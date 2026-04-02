import { CopyVariant } from '../content-schema'
import { StyleConfig } from '../styles'
import {
  BADGE_GRADIENT,
  FONT_LINK,
  highlightAccentWord,
  buildBaseCSS,
  buildBadgeFreeCSS,
  STORY_HEIGHT,
} from './shared'

/**
 * LIGHT-ARC — fundo branco, arco em gradiente emoldurando a imagem,
 * headline + hook na parte superior, CTA flutuando sobre a imagem.
 *
 * Anatomia (540×675px):
 *   - Fundo: #ffffff
 *   - Topo: headline (30px/900) à esquerda + badge "Grátis" à direita
 *   - Hook: texto simples cinza abaixo do topo
 *   - Arch-frame: imagem em moldura arredondada com borda gradiente
 *   - CTA: absoluto na base da arch-frame
 */
export function buildLightArc(variant: CopyVariant, imageSrc: string, _styleConfig: StyleConfig, isStory = false): string {
  const headlineHtml = highlightAccentWord(variant.headline, variant.accentWord)
  const H = isStory ? STORY_HEIGHT : 675
  const archWidth = isStory ? 440 : 340
  const headlineSz = isStory ? 36 : 30

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
${FONT_LINK}
<style>
  ${buildBaseCSS(540, H, '#ffffff')}

  .post-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 32px 36px 0;
    background: #ffffff;
    gap: 10px;
  }

  /* ── TOPO: headline + badge ── */
  .top-bar {
    width: 100%;
    max-width: ${archWidth}px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .headline {
    font-size: ${headlineSz}px;
    font-weight: 900;
    color: #0d0d0d;
    line-height: 1.05;
    letter-spacing: -0.02em;
    text-align: center;
    width: 100%;
  }

  .accent {
    background: ${BADGE_GRADIENT};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  ${buildBadgeFreeCSS(_styleConfig)}

  /* ── HOOK: texto simples cinza ── */
  .hook-text {
    width: 100%;
    max-width: ${archWidth}px;
    font-size: 12px;
    font-weight: 600;
    color: #999994;
    line-height: 1.4;
    letter-spacing: 0.01em;
    text-align: center;
  }

  /* ── ARCH FRAME ── */
  .arch-frame {
    position: relative;
    width: ${archWidth}px;
    flex: 1;
    align-self: center;
    min-height: 0;
  }

  /* Borda gradiente da arch */
  .arch-border {
    position: absolute;
    inset: -3px;
    border-radius: 183px 183px 0 0;
    background: ${BADGE_GRADIENT};
    z-index: 0;
  }

  /* Container da imagem dentro da borda */
  .arch-img-wrap {
    position: absolute;
    inset: 0;
    border-radius: 180px 180px 0 0;
    overflow: hidden;
    z-index: 1;
  }

  .arch-img-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 20%;
    display: block;
  }

  /* ── CTA flutuante sobre a imagem ── */
  .cta-wrap {
    position: absolute;
    bottom: 28px;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    z-index: 10;
  }

  .cta-btn {
    background: ${BADGE_GRADIENT};
    color: #ffffff;
    font-family: 'Nunito', sans-serif;
    font-size: 15px;
    font-weight: 800;
    border-radius: 100px;
    padding: 13px 28px;
    border: none;
    cursor: pointer;
    box-shadow: 0 6px 24px rgba(0,0,0,0.25);
    white-space: nowrap;
  }
</style>
</head>
<body>
<div class="post-wrapper">

  <!-- TOPO -->
  <div class="top-bar">
    <div class="headline" data-slot="headline">${headlineHtml}</div>
  </div>

  <!-- HOOK -->
  <div class="hook-text" data-slot="hook">${variant.hook}</div>

  <!-- ARCH FRAME -->
  <div class="arch-frame">
    <div class="arch-border"></div>
    <div class="arch-img-wrap">
      <img src="${imageSrc}" alt="" />
    </div>
    <div class="cta-wrap">
      <div class="cta-btn" data-slot="cta">${variant.cta}</div>
    </div>
  </div>

</div>
</body>
</html>`
}
