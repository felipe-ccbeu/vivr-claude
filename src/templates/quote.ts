import { CopyVariant } from '../content-schema'
import { StyleConfig } from '../styles'
import { BADGE_GRADIENT, FONT_LINK, highlightAccentWord, STORY_HEIGHT, STORY_SAFE_BOTTOM } from './shared'

/**
 * QUOTE — Prova Social / Testemunho (540×675px)
 * Fundo branco. Testimonial em destaque com accent gradient. Imagem circular com borda gradiente.
 * Estrelas 4.8. Badge "100k". Ideal para: Social proof, trust-building, testimonial angle.
 */
export function buildQuote(variant: CopyVariant, imageSrc: string, _styleConfig: StyleConfig, isStory = false): string {
  const headlineHtml = highlightAccentWord(variant.headline, variant.accentWord)
  const H = isStory ? STORY_HEIGHT : 675
  const padBottom = isStory ? STORY_SAFE_BOTTOM : 40

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
${FONT_LINK}
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { width: 540px; height: ${H}px; overflow: hidden; font-family: 'Nunito', sans-serif; background: #ffffff; }

  .post-wrapper {
    width: 540px; height: ${H}px; overflow: hidden;
    background: #ffffff;
    display: flex; flex-direction: column; align-items: center;
    justify-content: space-between; padding: 40px 32px ${padBottom}px; position: relative;
  }

  .post-wrapper::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse at center, rgba(155,93,229,0.05) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }

  .header {
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 16px; z-index: 3; position: relative; width: 100%;
  }
  .stars { display: flex; gap: 2px; font-size: 14px; }
  .star { color: #f97040; }
  .rating-text { font-size: 12px; color: rgba(0,0,0,0.4); font-weight: 600; }
  .badge-users {
    display: inline-flex; align-items: center; padding: 6px 14px;
    border-radius: 100px; font-size: 11px; font-weight: 800; color: white;
    background: ${BADGE_GRADIENT}; letter-spacing: 0.3px; margin-left: auto;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  }

  .content {
    flex: 1; display: flex; flex-direction: column;
    justify-content: center; align-items: center; text-align: center;
    gap: 24px; z-index: 3; max-width: 400px; position: relative;
  }

  .testimonial {
    font-size: ${isStory ? 38 : 32}px; font-weight: 700; color: #1a1030;
    line-height: 1.5; font-style: italic; letter-spacing: 0.1px;
  }

  .accent {
    background: ${BADGE_GRADIENT};
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }

  .footer {
    display: flex; flex-direction: column; align-items: center;
    gap: 6px; z-index: 3; position: relative;
  }

  .image-circle {
    width: 60px; height: 60px; border-radius: 50%; overflow: hidden;
    padding: 2px;
    background: ${BADGE_GRADIENT};
    flex-shrink: 0;
  }
  .image-circle-inner {
    width: 100%; height: 100%; border-radius: 50%; overflow: hidden;
  }
  .image-circle img {
    width: 140%; height: 140%; object-fit: cover; object-position: center 25%;
    margin-left: -20%; margin-top: -20%;
  }

  .person-name { font-size: 13px; font-weight: 700; color: #1a1030; letter-spacing: 0.1px; }
  .person-title { font-size: 11px; color: rgba(26,16,48,0.45); font-weight: 600; }

  .cta-section {
    display: flex; flex-direction: column; align-items: center;
    gap: 8px; margin-top: 16px; z-index: 3; position: relative;
  }

  .cta-btn {
    display: inline-flex; align-items: center; padding: 14px 32px;
    border-radius: 100px; font-size: 15px; font-weight: 800; color: white;
    background: ${BADGE_GRADIENT}; letter-spacing: 0.3px; white-space: nowrap;
    box-shadow: 0 4px 16px rgba(233,72,153,0.25);
  }

  .cta-sublabel { font-size: 11px; color: rgba(26,16,48,0.4); font-weight: 600; }
</style>
</head>
<body>
<div class="post-wrapper">

  <div class="header">
    <div class="stars">
      <span class="star">★</span><span class="star">★</span><span class="star">★</span>
      <span class="star">★</span><span class="star">★</span>
    </div>
    <div class="rating-text">4.8</div>
    <div class="badge-users">100k usuários</div>
  </div>

  <div class="content">
    <div class="testimonial" data-slot="headline">${headlineHtml}</div>
  </div>

  <div class="footer">
    <div class="image-circle">
      <div class="image-circle-inner">
        <img src="${imageSrc}" alt="" />
      </div>
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
