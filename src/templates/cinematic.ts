import { CopyVariant } from '../content-schema'
import { StyleConfig } from '../styles'
import {
  FONT_LINK,
  highlightAccentWord,
  buildBaseCSS,
  buildAccentCSS,
  buildCTABtnCSS,
  buildCTARowCSS,
} from './shared'

/**
 * CINEMATIC — imagem ocupa 100% do frame (540×675px).
 * Texto mínimo em dois pontos fixos: hook no topo, headline+CTA na base.
 * Sem painel separado. Overlay ultra-suave — a imagem faz o trabalho.
 *
 * Funciona melhor com:
 *   - Imagens com personagem centralizado e espaço livre no topo e base
 *   - Headlines curtas: 3–4 palavras, até 2 linhas
 *   - Hook: 1 frase curta, tom provocativo
 *   - Body: OMITIDO — sem espaço, sem necessidade
 *   - CTA: máx 3 palavras
 *
 * O efeito "cinema" vem de:
 *   1. Letterbox bars (faixas pretas top/bottom, 28px cada)
 *   2. Overlay sutil só na base (não cobre o personagem)
 *   3. Tipografia oversized com peso máximo
 *   4. Sem bordas, sem pills, sem badges — apenas texto sobre imagem
 */
export function buildCinematic(variant: CopyVariant, imageSrc: string, styleConfig: StyleConfig): string {
  const headlineHtml = highlightAccentWord(variant.headline, variant.accentWord)
  // Cinematic usa apenas a primeira frase do hook — curto e direto
  const hookLine = variant.hook.split(/[.!?]/)[0].trim()

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
${FONT_LINK}
<style>
  ${buildBaseCSS(540, 675, '#000')}

  /* ── IMAGEM FULL-BLEED ── */
  .bg-img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 25%;
    display: block;
  }

  /* ── LETTERBOX BARS (efeito cinema) ── */
  /*
   * Faixas pretas no topo e base — 28px cada.
   * Não são overlay: são elementos sólidos que cobrem
   * as bordas da imagem, criando o crop cinematográfico.
   */
  .bar-top,
  .bar-bottom {
    position: absolute;
    left: 0; right: 0;
    height: 28px;
    background: #000;
    z-index: 10;
  }
  .bar-top    { top: 0; }
  .bar-bottom { bottom: 0; }

  /* ── OVERLAY BASE — só na metade inferior ── */
  /*
   * Começa transparente no centro e vai para preto na base.
   * Não afeta o personagem (que fica no centro da imagem).
   * Garante legibilidade do headline sem escurecer a cena.
   */
  .overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      transparent 0%,
      transparent 40%,
      rgba(0,0,0,0.20) 58%,
      rgba(0,0,0,0.72) 78%,
      rgba(0,0,0,0.90) 92%,
      rgba(0,0,0,0.90) 100%
    );
    z-index: 2;
  }

  /* Overlay topo leve — para o hook ser legível */
  .overlay-top {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 160px;
    background: linear-gradient(
      to bottom,
      rgba(0,0,0,0.52) 0%,
      transparent 100%
    );
    z-index: 2;
  }

  /* ── HOOK — topo, dentro da letterbox superior ── */
  .hook-line {
    position: absolute;
    top: 44px;        /* abaixo da bar-top (28px) + 16px de respiro */
    left: 28px;
    right: 28px;
    font-size: 11px;
    font-weight: 700;
    color: rgba(255,255,255,0.72);
    letter-spacing: 0.18em;
    text-transform: uppercase;
    z-index: 20;
    /* linha divisória à esquerda — estilo legenda de filme */
    padding-left: 10px;
    border-left: 2px solid ${styleConfig.colors.primary};
  }

  /* ── CONTEÚDO BASE ── */
  .base-content {
    position: absolute;
    bottom: 36px;     /* acima da bar-bottom (28px) + 8px */
    left: 28px;
    right: 28px;
    z-index: 20;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  /* Headline — grande, impactante, máx 2 linhas */
  .headline {
    font-size: 46px;
    font-weight: 900;
    color: #ffffff;
    line-height: 1.0;
    letter-spacing: -0.04em;
    /* text-shadow sutil para separar da imagem sem parecer glow */
    text-shadow: 0 2px 24px rgba(0,0,0,0.55);
  }

  ${buildAccentCSS(styleConfig.colors.accentWord, 'filter: drop-shadow(0 0 12px rgba(249,112,64,0.45));')}

  /* CTA row: botão + sub-label */
  ${buildCTARowCSS('14px', '4px')}

  ${buildCTABtnCSS(styleConfig, '11px 24px', true)}

  /* Sub-label discreto ao lado do CTA */
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

  <!-- IMAGEM -->
  <img class="bg-img" src="${imageSrc}" alt="" />

  <!-- OVERLAYS -->
  <div class="overlay-top"></div>
  <div class="overlay"></div>

  <!-- LETTERBOX -->
  <div class="bar-top"></div>
  <div class="bar-bottom"></div>

  <!-- HOOK (topo) -->
  <div class="hook-line" data-slot="hook">${hookLine}</div>

  <!-- HEADLINE + CTA (base) -->
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