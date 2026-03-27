import { CopyVariant } from '../content-schema'
import { StyleConfig } from '../styles'
import { FONT_LINK, highlightAccentWord } from './shared'

/**
 * BOLD-TEXT — Tipografia Oversized (540×675px)
 * Zero imagem. Headline gigante (70px+). Fundo gradiente de marca.
 * Ideal para: Scroll-stopping power, type-first design, scroll ads.
 */
export function buildBoldText(variant: CopyVariant, _imageSrc: string, styleConfig: StyleConfig): string {
  const headlineHtml = highlightAccentWord(variant.headline, variant.accentWord)

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
    background: linear-gradient(135deg, #89c7fe 0%, #8bfbd1 25%, #ae90fb 50%, #f599b5 75%, #fdd38a 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 28px;
    position: relative;
    overflow: hidden;
  }

  /* Subtle background pattern */
  .post-wrapper::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at 20% 30%, rgba(255,255,255,0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(0,0,0,0.05) 0%, transparent 50%);
    pointer-events: none;
    z-index: 1;
  }

  .content {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 20px;
    max-width: 440px;
  }

  /* Hook: small text at top */
  .hook {
    font-size: 12px;
    font-weight: 700;
    color: rgba(255,255,255,0.7);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 8px;
    data-slot: 'hook';
  }

  /* Headline: the star */
  .headline {
    font-size: 72px;
    font-weight: 900;
    color: white;
    line-height: 1;
    letter-spacing: -2px;
    text-shadow:
      0 2px 8px rgba(0,0,0,0.2),
      0 4px 16px rgba(0,0,0,0.15);
    word-spacing: -0.15em;
    margin-bottom: 16px;
  }

  .accent {
    background: linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.8) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
  }

  /* Body: minimal */
  .body-copy {
    font-size: 13px;
    font-weight: 500;
    color: rgba(255,255,255,0.75);
    line-height: 1.5;
    letter-spacing: 0.2px;
    max-width: 380px;
    margin-bottom: 24px;
  }

  /* CTA */
  .cta-btn {
    display: inline-flex;
    align-items: center;
    padding: 14px 28px;
    border-radius: 50px;
    font-size: 15px;
    font-weight: 900;
    color: #1a1030;
    background: rgba(255,255,255,0.95);
    letter-spacing: 0.3px;
    white-space: nowrap;
    cursor: pointer;
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    transition: all 200ms ease-out;
  }

  .cta-btn:hover {
    transform: translateY(-2px);
    background: white;
    box-shadow: 0 12px 32px rgba(0,0,0,0.2);
  }

  /* Decorative elements */
  .decor-dot {
    position: absolute;
    border-radius: 50%;
    opacity: 0.1;
  }

  .decor-1 {
    width: 120px;
    height: 120px;
    background: rgba(255,255,255,0.3);
    top: -40px;
    right: -40px;
  }

  .decor-2 {
    width: 80px;
    height: 80px;
    background: rgba(0,0,0,0.2);
    bottom: -20px;
    left: -20px;
  }
</style>
</head>
<body>
<div class="post-wrapper">
  <div class="decor-dot decor-1"></div>
  <div class="decor-dot decor-2"></div>

  <div class="content">
    <div class="hook" data-slot="hook">${variant.hook}</div>
    <div class="headline" data-slot="headline">${headlineHtml}</div>
    <div class="body-copy" data-slot="body">${variant.body}</div>
    <div class="cta-btn" data-slot="cta">${variant.cta}</div>
  </div>
</div>
</body>
</html>`
}
