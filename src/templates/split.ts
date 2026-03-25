import { CampaignBrief } from '../types'
import { BRAND_GRADIENT, FONT_LINK, highlightAccentWord } from './shared'

/**
 * SPLIT — imagem ocupa o topo (370px), painel de texto escuro ocupa o rodapé (305px).
 * Hook aparece como tag translúcida sobre a imagem.
 * Layout limpo, tipografia grande, CTA alinhado à esquerda.
 */
export function buildSplit(brief: CampaignBrief, imageDataUrl: string): string {
  const headlineHtml = highlightAccentWord(brief.copy.headline, brief.copy.accentWord)

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
${FONT_LINK}
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { width: 540px; height: 675px; overflow: hidden; font-family: 'Nunito', sans-serif; }

  .post-wrapper {
    width: 540px;
    height: 675px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  /* ── IMAGE SECTION ── */
  .img-section {
    position: relative;
    width: 540px;
    height: 370px;
    flex-shrink: 0;
    overflow: hidden;
  }

  .img-section img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center top;
    display: block;
  }

  .img-vignette {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(0,0,0,0) 55%,
      rgba(13,13,13,1) 100%
    );
  }

  .hook-tag {
    position: absolute;
    top: 18px;
    left: 20px;
    background: rgba(0,0,0,0.52);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 20px;
    padding: 6px 14px;
    font-size: 12px;
    font-weight: 700;
    color: rgba(255,255,255,0.88);
    letter-spacing: 0.2px;
    max-width: 300px;
  }

  .badge-free {
    position: absolute;
    top: 18px;
    right: 20px;
    display: inline-flex;
    align-items: center;
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 800;
    color: white;
    background: ${BRAND_GRADIENT};
    letter-spacing: 0.3px;
  }

  /* ── TEXT SECTION ── */
  .text-section {
    flex: 1;
    background: #0d0d0d;
    padding: 22px 28px 26px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .headline {
    font-size: 34px;
    font-weight: 900;
    color: white;
    line-height: 1.1;
    letter-spacing: -0.5px;
  }

  .accent {
    background: ${BRAND_GRADIENT};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .body-copy {
    font-size: 13px;
    font-weight: 400;
    color: rgba(255,255,255,0.48);
    line-height: 1.55;
    margin-top: 10px;
    max-width: 440px;
  }

  .cta-btn {
    display: inline-flex;
    align-items: center;
    padding: 13px 28px;
    border-radius: 50px;
    font-size: 15px;
    font-weight: 800;
    color: white;
    background: ${BRAND_GRADIENT};
    letter-spacing: 0.2px;
    white-space: nowrap;
    align-self: flex-start;
  }
</style>
</head>
<body>
<div class="post-wrapper">
  <div class="img-section">
    <img src="${imageDataUrl}" alt="" />
    <div class="img-vignette"></div>
    <span class="hook-tag" data-slot="hook">${brief.copy.hook}</span>
    <span class="badge-free">Grátis</span>
  </div>
  <div class="text-section">
    <div>
      <div class="headline" data-slot="headline">${headlineHtml}</div>
      <div class="body-copy" data-slot="body">${brief.copy.body}</div>
    </div>
    <div class="cta-btn" data-slot="cta">${brief.copy.cta}</div>
  </div>
</div>
</body>
</html>`
}