import { CopyVariant } from '../content-schema'
import { StyleConfig } from '../styles'
import {
  FONT_LINK,
  highlightAccentWord,
  buildBaseCSS,
  buildAccentCSS,
  buildCTABtnCSS,
  buildHookPillCSS,
  buildBadgeFreeCSS,
  buildCTARowCSS,
} from './shared'

/**
 * LIGHT-ARC — imagem full-bleed, painel de copy branco com recorte em arco SVG
 * na transição imagem→texto. Estética clean/premium, sem overlay escuro.
 *
 * Anatomia (540×675px):
 *   - Imagem: 100% largura, ~420px de altura (cobre 62% do frame)
 *   - Arco SVG: sobrepõe a base da imagem, cria transição orgânica para o painel
 *   - Painel branco: restante inferior, copy sobre fundo claro
 *
 * Copy constraints (ideal para esse template):
 *   - headline: máx 5 palavras / 2 linhas
 *   - body: máx 1 frase / 12 palavras
 *   - hook: máx 6 palavras (aparece como pill sobre a imagem)
 */
export function buildLightArc(variant: CopyVariant, imageSrc: string, styleConfig: StyleConfig): string {
  const headlineHtml = highlightAccentWord(variant.headline, variant.accentWord)

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
${FONT_LINK}
<style>
  ${buildBaseCSS(540, 675, '#f5f4f0')}

  /* ── IMAGEM FULL-BLEED ── */
  .img-layer {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 430px;
    overflow: hidden;
  }

  .img-layer img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 30%;
    display: block;
  }

  ${buildHookPillCSS(styleConfig, 'rgba(255,255,255,0.88)')}

  ${buildBadgeFreeCSS(styleConfig)}

  /* ── ARCO SVG — transição imagem → painel ── */
  /*
   * O SVG fica posicionado sobre a base da imagem.
   * Path: começa na esquerda na altura H, sobe em curva para o centro (~40px),
   * desce de volta à direita. Fill branco cobre a base da imagem
   * criando a transição orgânica.
   *
   * viewBox: 540 × 80 (altura do arco)
   * O SVG se sobrepõe 30px à imagem (top: 370px) e ao painel (fica acima)
   */
  .arc-svg {
    position: absolute;
    top: 362px;       /* base da imagem - altura do arco */
    left: 0;
    width: 540px;
    height: 80px;
    z-index: 5;
    display: block;
  }

  /* ── PAINEL DE COPY — fundo claro ── */
  .text-panel {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    top: 410px;       /* começa abaixo do pico do arco */
    background: #f5f4f0;
    padding: 0 28px 28px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    z-index: 4;
  }

  /* Linha de separação sutil (abaixo do arco, acima do headline) */
  .rule {
    width: 36px;
    height: 3px;
    border-radius: 2px;
    background: ${styleConfig.colors.primary};
    margin-bottom: 10px;
    /* a rule substitui o separator gradient do split */
    /* vem de uma string CSS, não do styleConfig — intencional para light */
    background: linear-gradient(90deg, #FF6B35, #9b5de5);
  }

  .headline {
    font-size: 34px;
    font-weight: 900;
    color: #0d0d0d;
    line-height: 1.05;
    letter-spacing: -0.03em;
  }

  ${buildAccentCSS(styleConfig.colors.accentWord)}

  .body-copy {
    font-size: 13.5px;
    font-weight: 500;
    color: #555550;
    line-height: 1.5;
    margin-top: 10px;
    max-width: 340px;
    /* clamp a 2 linhas — copy curto é obrigatório nesse template */
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  ${buildCTARowCSS('14px', '6px')}

  ${buildCTABtnCSS(styleConfig, '13px 26px', false)}

  /* Logo Vivr discreto */
  .vivr-mark {
    font-size: 11px;
    font-weight: 700;
    color: #aaa9a2;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
</style>
</head>
<body>
<div class="post-wrapper">

  <!-- IMAGEM -->
  <div class="img-layer">
    <img src="${imageSrc}" alt="" />
    <span class="hook-pill" data-slot="hook">${variant.hook}</span>
    <span class="badge-free">Grátis</span>
  </div>

  <!--
    ARCO SVG
    Path explicado:
      M0,68        → começa no canto esquerdo baixo do arco
      C80,68       → control point 1: mantém esquerda horizontal
       200,8        → control point 2: puxa pico para esquerda-centro
       270,8        → pico do arco (centro-esquerdo)
      C340,8        → control point 3: mantém pico
       460,68       → control point 4: desce para direita
       540,68       → chega no canto direito
      L540,80 L0,80 Z → fecha o shape no rodapé
  -->
  <svg class="arc-svg" viewBox="0 0 540 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
    <path d="M0,68 C80,68 200,8 270,8 C340,8 460,68 540,68 L540,80 L0,80 Z" fill="#f5f4f0"/>
  </svg>

  <!-- PAINEL DE COPY -->
  <div class="text-panel">
    <div>
      <div class="rule"></div>
      <div class="headline" data-slot="headline">${headlineHtml}</div>
      <div class="body-copy" data-slot="body">${variant.body}</div>
    </div>
    <div class="cta-row">
      <div class="cta-btn" data-slot="cta">${variant.cta}</div>
      <span class="vivr-mark">Vivr</span>
    </div>
  </div>

</div>
</body>
</html>`
}