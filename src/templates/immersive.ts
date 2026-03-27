import { CopyVariant } from '../content-schema'
import { StyleConfig } from '../styles'
import { FONT_LINK, highlightAccentWord } from './shared'

/**
 * IMMERSIVE — Full-bleed com Vinheta Radial (540×675px)
 * Imagem 100%. Vinheta radial escura no centro para legibilidade.
 * Texto centralizado verticalmente, flutuando sobre a imagem.
 * Ideal para: Cenas cinematográficas. Profundidade extrema.
 */
export function buildImmersive(variant: CopyVariant, imageSrc: string, styleConfig: StyleConfig): string {
  const headlineHtml = highlightAccentWord(variant.headline, variant.accentWord)

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
${FONT_LINK}
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { width: 540px; height: 675px; overflow: hidden; font-family: 'Nunito', sans-serif; background: #000; }

  .post-wrapper {
    width: 540px;
    height: 675px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    position: relative;
  }

  /* Full-bleed image */
  .image-layer {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  .image-layer img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 25%;
    display: block;
  }

  /* Radial vignette: edges dark, center light */
  .vignette-layer {
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle at center,
      rgba(0,0,0,0.0) 0%,
      rgba(0,0,0,0.3) 40%,
      rgba(0,0,0,0.6) 75%,
      rgba(0,0,0,0.75) 100%
    );
    pointer-events: none;
    z-index: 1;
  }

  /* Content layer: text centered */
  .content-layer {
    position: relative;
    z-index: 2;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 32px;
  }

  /* Hook: top */
  .hook-tag {
    position: absolute;
    top: 28px;
    left: 24px;
    background: rgba(0,0,0,0.55);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 20px;
    padding: 8px 14px;
    font-size: 11px;
    font-weight: 700;
    color: rgba(255,255,255,0.85);
    letter-spacing: 0.2px;
    max-width: 360px;
    line-height: 1.3;
    box-shadow: 0 0 0 1px rgba(137,199,254,0.2);
  }

  /* Content text: centered vertically */
  .text-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 16px;
    max-width: 420px;
  }

  /* Headline: huge, centered */
  .headline {
    font-size: 42px;
    font-weight: 900;
    color: #ffffff;
    line-height: 1.08;
    letter-spacing: -1px;
    text-shadow:
      0 2px 8px rgba(0,0,0,0.4),
      0 4px 16px rgba(0,0,0,0.3),
      0 8px 24px rgba(0,0,0,0.2);
  }

  .accent {
    background: linear-gradient(135deg, #89c7fe, #8bfbd1, #ae90fb);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    filter: drop-shadow(0 0 12px rgba(137,199,254,0.35));
  }

  /* Body: below headline */
  .body-copy {
    font-size: 14px;
    font-weight: 500;
    color: rgba(255,255,255,0.75);
    line-height: 1.6;
    letter-spacing: 0.1px;
  }

  /* CTA: bottom center */
  .cta-section {
    position: absolute;
    bottom: 32px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 3;
  }

  .cta-btn {
    display: inline-flex;
    align-items: center;
    padding: 14px 30px;
    border-radius: 50px;
    font-size: 15px;
    font-weight: 900;
    color: white;
    background: linear-gradient(135deg, #89c7fe, #ae90fb);
    letter-spacing: 0.3px;
    white-space: nowrap;
    cursor: pointer;
    box-shadow:
      0 0 0 1px rgba(137,199,254,0.3),
      0 4px 16px rgba(137,199,254,0.3),
      0 8px 32px rgba(155,93,229,0.2);
    transition: all 200ms ease-out;
  }

  .cta-btn:hover {
    transform: translateY(-2px);
    box-shadow:
      0 0 0 1px rgba(137,199,254,0.5),
      0 8px 24px rgba(137,199,254,0.35),
      0 12px 40px rgba(155,93,229,0.25);
  }
</style>
</head>
<body>
<div class="post-wrapper">
  <div class="image-layer">
    <img src="${imageSrc}" alt="" />
  </div>

  <div class="vignette-layer"></div>

  <div class="hook-tag" data-slot="hook">${variant.hook}</div>

  <div class="content-layer">
    <div class="text-content">
      <div class="headline" data-slot="headline">${headlineHtml}</div>
      <div class="body-copy" data-slot="body">${variant.body}</div>
    </div>
  </div>

  <div class="cta-section">
    <div class="cta-btn" data-slot="cta">${variant.cta}</div>
  </div>
</div>
</body>
</html>`
}
