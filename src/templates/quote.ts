import { CopyVariant } from '../content-schema'
import { StyleConfig } from '../styles'
import { FONT_LINK, highlightAccentWord, BRAND_GRADIENT } from './shared'

/**
 * QUOTE — Prova Social / Testemunho (540×675px)
 * Fundo gradiente. Aspas gigantes decorativas. Testimonial em destaque.
 * Imagem do personagem pequena e circular. Estrelas 4.8. Badge "100k".
 * Ideal para: Social proof, trust-building, testimonial angle.
 */
export function buildQuote(variant: CopyVariant, imageSrc: string, styleConfig: StyleConfig): string {
  const headlineHtml = highlightAccentWord(variant.headline, variant.accentWord)

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
${FONT_LINK}
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { width: 540px; height: 675px; overflow: hidden; font-family: 'Nunito', sans-serif; background: #0d0d0d; }

  .post-wrapper {
    width: 540px;
    height: 675px;
    overflow: hidden;
    background: #1A1030;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 40px 32px;
    position: relative;
  }

  /* Radial glow in dark background */
  .post-wrapper::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at center, rgba(155,93,229,0.15) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  /* Decorative quotes */
  .quote-mark {
    position: absolute;
    font-size: 120px;
    font-weight: 900;
    opacity: 0.08;
    color: ${styleConfig.colors.primary || '#89c7fe'};
    line-height: 1;
  }

  .quote-mark-top {
    top: 20px;
    left: 20px;
  }

  .quote-mark-bottom {
    bottom: 120px;
    right: 20px;
    transform: rotate(180deg);
  }

  /* Header: stars + badge */
  .header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
    z-index: 3;
    position: relative;
  }

  .stars {
    display: flex;
    gap: 2px;
    font-size: 14px;
  }

  .star {
    color: #fdd38a;
  }

  .rating-text {
    font-size: 12px;
    color: rgba(255,255,255,0.6);
    font-weight: 600;
  }

  .badge-users {
    display: inline-flex;
    align-items: center;
    padding: 6px 14px;
    border-radius: 100px;
    font-size: 11px;
    font-weight: 800;
    color: white;
    background: linear-gradient(135deg, #89c7fe 0%, #8bfbd1 20%, #ae90fb 45%, #f599b5 70%, #fdd38a 100%);
    letter-spacing: 0.3px;
    margin-left: auto;
    box-shadow: 0 2px 8px rgba(137,199,254,0.2);
  }

  /* Testimonial content */
  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    gap: 24px;
    z-index: 3;
    max-width: 400px;
    position: relative;
  }

  .testimonial {
    font-size: 18px;
    font-weight: 500;
    color: rgba(255,255,255,0.88);
    line-height: 1.6;
    font-style: italic;
    letter-spacing: 0.2px;
  }

  /* Image footer: circular + small */
  .footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    z-index: 3;
    position: relative;
  }

  .image-circle {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid;
    border-image: linear-gradient(135deg, ${styleConfig.colors.primary || '#89c7fe'}, ${styleConfig.colors.secondary || '#ae90fb'}) 1;
    flex-shrink: 0;
  }

  .image-circle img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 25%;
  }

  .person-name {
    font-size: 13px;
    font-weight: 700;
    color: rgba(255,255,255,0.8);
    letter-spacing: 0.1px;
  }

  .person-title {
    font-size: 11px;
    color: rgba(255,255,255,0.5);
  }

  /* CTA bottom */
  .cta-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    margin-top: 16px;
    z-index: 3;
    position: relative;
  }

  .cta-btn {
    display: inline-flex;
    align-items: center;
    padding: 14px 32px;
    border-radius: 100px;
    font-size: 15px;
    font-weight: 800;
    color: white;
    background: linear-gradient(135deg, #89c7fe 0%, #8bfbd1 20%, #ae90fb 45%, #f599b5 70%, #fdd38a 100%);
    letter-spacing: 0.3px;
    white-space: nowrap;
    cursor: pointer;
    box-shadow: 0 4px 16px rgba(137,199,254,0.3);
    transition: all 200ms ease-out;
  }

  .cta-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(137,199,254,0.4);
  }

  .cta-sublabel {
    font-size: 11px;
    color: rgba(255,255,255,0.5);
    font-weight: 600;
  }
</style>
</head>
<body>
<div class="post-wrapper">
  <div class="quote-mark quote-mark-top">"</div>
  <div class="quote-mark quote-mark-bottom">"</div>

  <div class="header">
    <div class="stars">
      <span class="star">★</span>
      <span class="star">★</span>
      <span class="star">★</span>
      <span class="star">★</span>
      <span class="star">★</span>
    </div>
    <div class="rating-text">4.8</div>
    <div class="badge-users">100k usuários</div>
  </div>

  <div class="content">
    <div class="testimonial" data-slot="headline">${headlineHtml}</div>
  </div>

  <div class="footer">
    <div class="image-circle">
      <img src="${imageSrc}" alt="" />
    </div>
    <div class="person-name" data-slot="hook">Usuário satisfeito</div>
    <div class="person-title">Treina há 30 dias</div>
  </div>

  <div class="cta-section">
    <div class="cta-btn" data-slot="cta">${variant.cta}</div>
    <div class="cta-sublabel">Comece sua jornada agora</div>
  </div>
</div>
</body>
</html>`
}
