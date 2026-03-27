import { CopyVariant } from '../content-schema'
import { StyleConfig } from '../styles'
import { FONT_LINK, highlightAccentWord } from './shared'

/**
 * OVERLAY — imagem full-bleed com overlay escuro degradê na base.
 * Texto (headline, body, CTA) flutua sobre a imagem no rodapé.
 * Speech bubble com hook curto posicionado no centro-direito, com cauda.
 * Supports all design variations via StyleConfig parameter.
 */
export function buildOverlay(variant: CopyVariant, imageSrc: string, styleConfig: StyleConfig): string {
  const headlineHtml = highlightAccentWord(variant.headline, variant.accentWord)
  // First sentence only — keeps the bubble tight
  const hookShort = variant.hook.split(/[.!?]/)[0].trim()

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
${FONT_LINK}
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { width: 540px; height: 675px; overflow: hidden; font-family: 'Nunito', sans-serif; }

  .post-wrapper {
    position: relative;
    width: 540px;
    height: 675px;
    overflow: hidden;
  }

  .bg {
    position: absolute;
    inset: 0;
    background-image: url('${imageSrc}');
    background-size: cover;
    background-position: center top;
  }

  /* Fade starts earlier so the cut-off feels intentional, not abrupt */
  .overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(8,8,8,0.05) 0%,
      rgba(8,8,8,0.00) 18%,
      rgba(8,8,8,0.30) 38%,
      rgba(8,8,8,0.82) 60%,
      rgba(8,8,8,0.96) 100%
    );
  }

  .content {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    padding: 20px 24px 28px;
  }

  /* Speech bubble — anchored mid-right with tail pointing toward character */
  .speech-bubble {
    position: absolute;
    top: 42%;
    right: 22px;
    transform: translateY(-50%);
    background: white;
    border-radius: 16px 16px 4px 16px;
    padding: 10px 14px;
    max-width: 160px;
    font-size: 13px;
    font-weight: 700;
    color: #1a1a1a;
    line-height: 1.35;
    box-shadow: 0 4px 18px rgba(0,0,0,0.25);
    z-index: 10;
  }

  /* Tail pointing down-left toward character center */
  .speech-bubble::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 18px;
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 6px solid transparent;
    border-top: 12px solid white;
  }

  .spacer { flex: 1; }

  .bottom {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .headline {
    font-size: 38px;
    font-weight: 900;
    color: white;
    line-height: 1.08;
    letter-spacing: -0.5px;
  }

  /* Accent word: gradient + slight size bump + glow so it pops on dark overlay */
  .accent {
    font-size: 1.08em;
    background: ${styleConfig.colors.accentWord};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    filter: drop-shadow(0 0 10px rgba(249,112,64,0.55));
  }

  .body-copy {
    font-size: 15px;
    font-weight: 600;
    color: rgba(255,255,255,0.62);
    line-height: 1.45;
    max-width: 310px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .cta-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 6px;
  }

  .cta-btn {
    display: inline-flex;
    align-items: center;
    padding: 12px 26px;
    border-radius: 50px;
    font-size: 14px;
    font-weight: 800;
    color: ${styleConfig.colors.ctaText};
    background: ${styleConfig.colors.ctaBg};
    letter-spacing: 0.2px;
    white-space: nowrap;
  }

  .sub-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 600;
    color: rgba(255,255,255,0.5);
  }

  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #f7c948;
    flex-shrink: 0;
  }
</style>
</head>
<body>
<div class="post-wrapper">
  <div class="bg"></div>
  <div class="overlay"></div>
  <div class="content">
    <div class="spacer"></div>
    <div class="speech-bubble" data-slot="hook">${hookShort}</div>
    <div class="bottom">
      <div class="headline" data-slot="headline">${headlineHtml}</div>
      <div class="body-copy" data-slot="body">${variant.body}</div>
      <div class="cta-row">
        <div class="cta-btn" data-slot="cta">${variant.cta}</div>
        <div class="sub-badge">
          <span class="dot"></span>
          É grátis pra começar
        </div>
      </div>
    </div>
  </div>
</div>
</body>
</html>`
}