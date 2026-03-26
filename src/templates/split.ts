import { CampaignBrief } from '../types'
import { BRAND_GRADIENT, FONT_LINK, highlightAccentWord } from './shared'

/**
 * SPLIT — imagem ocupa o topo (370px), painel de texto escuro ocupa o rodapé (305px).
 * Hook aparece como tag translúcida sobre a imagem.
 * Layout limpo, tipografia grande, CTA alinhado à esquerda.
 *
 * UI/UX: OLED dark mode (contrast 7:1+), hierarquia tipográfica clara,
 * vignette suave em 3 stops, CTA com glow sutil, hook com borda gradiente.
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
  body { width: 540px; height: 675px; overflow: hidden; font-family: 'Nunito', sans-serif; background: #000; }

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
    object-position: center 65%;
    display: block;
  }

  /* 3-stop vignette: transparente → semi → opaco. Transição suave sem corte brusco. */
  .img-vignette {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(0,0,0,0) 42%,
      rgba(0,0,0,0.55) 72%,
      rgba(13,13,13,1) 100%
    );
  }

  /* Hook tag com borda gradiente via box-shadow multicamada */
  .hook-tag {
    position: absolute;
    top: 18px;
    left: 20px;
    background: rgba(0,0,0,0.62);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.18);
    border-radius: 20px;
    padding: 7px 15px;
    font-size: 11.5px;
    font-weight: 700;
    color: rgba(255,255,255,0.92);
    letter-spacing: 0.15px;
    max-width: 310px;
    line-height: 1.35;
    /* glow sutil de marca no bottom da borda */
    box-shadow: 0 0 0 1px rgba(249,112,64,0.25), inset 0 1px 0 rgba(255,255,255,0.08);
  }

  .badge-free {
    position: absolute;
    top: 18px;
    right: 20px;
    display: inline-flex;
    align-items: center;
    padding: 5px 13px;
    border-radius: 20px;
    font-size: 11.5px;
    font-weight: 900;
    color: white;
    background: ${BRAND_GRADIENT};
    letter-spacing: 0.4px;
    /* glow de profundidade */
    box-shadow: 0 2px 12px rgba(233,72,153,0.4);
  }

  /* ── TEXT SECTION ── */
  /* Linha gradiente no topo como conexão visual com a imagem */
  .text-section {
    flex: 1;
    background: #0d0d0d;
    padding: 20px 36px 26px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    /* Fio gradiente no topo: conecta visualmente imagem e painel */
    border-top: 1.5px solid transparent;
    background-clip: padding-box;
    position: relative;
  }

  .text-section::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1.5px;
    background: linear-gradient(90deg, rgba(249,112,64,0.6) 0%, rgba(155,93,229,0.6) 50%, rgba(38,198,218,0.3) 100%);
  }

  /* Headline: 36px 900 — escala maior para impacto visual */
  .headline {
    font-size: 36px;
    font-weight: 900;
    color: #ffffff;
    line-height: 1.08;
    letter-spacing: -0.8px;
    /* sombra sutil para separar do fundo OLED */
    text-shadow: 0 1px 20px rgba(0,0,0,0.8);
  }

  /* Accent com glow sutil alinhado ao gradiente da marca */
  .accent {
    background: ${BRAND_GRADIENT};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    filter: drop-shadow(0 0 8px rgba(249,112,64,0.35));
  }

  /* Body: 14px, contraste 0.72 (WCAG AA no fundo #0d0d0d) */
  .body-copy {
    font-size: 14px;
    font-weight: 500;
    color: rgba(255,255,255,0.70);
    line-height: 1.6;
    margin-top: 11px;
    max-width: 430px;
    letter-spacing: 0.1px;
  }

  /* CTA com glow de marca, padding generoso, peso máximo */
  .cta-btn {
    display: inline-flex;
    align-items: center;
    padding: 13px 30px;
    border-radius: 50px;
    font-size: 14.5px;
    font-weight: 900;
    color: white;
    background: ${BRAND_GRADIENT};
    letter-spacing: 0.3px;
    white-space: nowrap;
    align-self: flex-start;
    /* glow multicamada: proximidade + distância */
    box-shadow:
      0 0 0 1px rgba(249,112,64,0.3),
      0 4px 16px rgba(233,72,153,0.35),
      0 8px 32px rgba(155,93,229,0.2);
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