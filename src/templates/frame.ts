import { CopyVariant } from '../content-schema'
import { StyleConfig } from '../styles'
import { FONT_LINK, highlightAccentWord } from './shared'

/**
 * FRAME — fundo escuro, imagem centralizada em um frame com borda gradiente.
 * Cria o efeito "portal" — a cena do app como janela para outro mundo.
 * Headline e CTA ficam abaixo do frame.
 * Supports all design variations via StyleConfig parameter.
 */
export function buildFrame(variant: CopyVariant, imageSrc: string, styleConfig: StyleConfig): string {
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
    position: relative;
    width: 540px;
    height: 675px;
    overflow: hidden;
    background: #1A1030;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 22px 28px 26px;
  }

  /* subtle radial glow on the bg */
  .post-wrapper::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 480px;
    height: 480px;
    background: radial-gradient(ellipse at center, rgba(155,93,229,0.18) 0%, transparent 70%);
    pointer-events: none;
  }

  /* ── TOP ROW ── */
  .top-row {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 18px;
    position: relative;
    z-index: 1;
  }

  .hook-text {
    font-size: 12px;
    font-weight: 700;
    color: rgba(255,255,255,0.45);
    letter-spacing: 0.3px;
    max-width: 260px;
    line-height: 1.4;
  }

  .badge-free {
    display: inline-flex;
    align-items: center;
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 800;
    color: white;
    background: ${styleConfig.colors.primary};
    letter-spacing: 0.3px;
    white-space: nowrap;
  }

  /* ── FRAME ── */
  .frame-outer {
    width: 320px;
    height: 348px;
    border-radius: 26px;
    padding: 3px;
    background: ${styleConfig.colors.primary};
    flex-shrink: 0;
    box-shadow:
      0 8px 40px rgba(0,0,0,0.6),
      0 0 60px rgba(155,93,229,0.25);
    position: relative;
    z-index: 1;
  }

  .frame-inner {
    width: 100%;
    height: 100%;
    border-radius: 24px;
    overflow: hidden;
  }

  .frame-inner img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center top;
    display: block;
  }

  /* ── TEXT BLOCK ── */
  .text-block {
    width: 100%;
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 9px;
    flex: 1;
    justify-content: flex-end;
    position: relative;
    z-index: 1;
  }

  .headline {
    font-size: 33px;
    font-weight: 900;
    color: white;
    line-height: 1.1;
    letter-spacing: -0.5px;
  }

  .accent {
    background: ${styleConfig.colors.primary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .body-copy {
    font-size: 13px;
    font-weight: 400;
    color: rgba(255,255,255,0.42);
    line-height: 1.55;
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
    background: ${styleConfig.colors.primary};
    letter-spacing: 0.2px;
    white-space: nowrap;
    align-self: flex-start;
    margin-top: 2px;
  }
</style>
</head>
<body>
<div class="post-wrapper">
  <div class="top-row">
    <span class="hook-text" data-slot="hook">${variant.hook}</span>
    <span class="badge-free">Grátis</span>
  </div>
  <div class="frame-outer">
    <div class="frame-inner">
      <img src="${imageSrc}" alt="" />
    </div>
  </div>
  <div class="text-block">
    <div class="headline" data-slot="headline">${headlineHtml}</div>
    <div class="body-copy" data-slot="body">${variant.body}</div>
    <div class="cta-btn" data-slot="cta">${variant.cta}</div>
  </div>
</div>
</body>
</html>`
}
