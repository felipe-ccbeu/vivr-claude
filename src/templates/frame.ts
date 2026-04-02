import { CopyVariant } from '../content-schema'
import { StyleConfig } from '../styles'
import { FONT_LINK, BADGE_GRADIENT, highlightAccentWord, STORY_HEIGHT, STORY_SAFE_BOTTOM } from './shared'

/**
 * FRAME — imagem centralizada em frame com borda gradiente.
 * Dark: fundo #0d0d0d, texto branco. Light: fundo #ffffff, texto #0d0d0d.
 */
export function buildFrame(variant: CopyVariant, imageSrc: string, styleConfig: StyleConfig, isStory = false): string {
  const headlineHtml = highlightAccentWord(variant.headline, variant.accentWord)
  const isLight = styleConfig.colors.background === '#ffffff'
  const H = isStory ? STORY_HEIGHT : 675
  const frameSize = isStory ? 420 : 320
  const textPadBottom = isStory ? STORY_SAFE_BOTTOM : 28
  const headlineSz = isStory ? 40 : 33

  const bg            = isLight ? '#ffffff' : '#0d0d0d'
  const glowOpacity   = isLight ? '0.07'    : '0.18'
  const hookColor     = isLight ? 'rgba(0,0,0,0.4)'       : 'rgba(255,255,255,0.45)'
  const frameBoxShadow = isLight
    ? '0 8px 40px rgba(0,0,0,0.12), 0 0 60px rgba(155,93,229,0.12)'
    : '0 8px 40px rgba(0,0,0,0.6),  0 0 60px rgba(155,93,229,0.25)'
  const headlineColor = isLight ? '#0d0d0d' : 'white'
  const bodyColor     = isLight ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.42)'

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
${FONT_LINK}
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { width: 540px; height: ${H}px; overflow: hidden; font-family: 'Nunito', sans-serif; }

  .post-wrapper {
    position: relative;
    width: 540px;
    height: ${H}px;
    overflow: hidden;
    background: ${bg};
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px 28px ${textPadBottom}px;
  }

  .post-wrapper::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 480px;
    height: 480px;
    background: radial-gradient(ellipse at center, rgba(155,93,229,${glowOpacity}) 0%, transparent 70%);
    pointer-events: none;
  }

  .top-row {
    width: ${frameSize}px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    position: relative;
    z-index: 1;
  }

  .hook-text {
    font-size: 12px;
    font-weight: 700;
    color: ${hookColor};
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
    background: ${BADGE_GRADIENT};
    letter-spacing: 0.3px;
    white-space: nowrap;
  }

  .frame-outer {
    width: ${frameSize}px;
    height: ${frameSize}px;
    border-radius: 26px;
    padding: 3px;
    background: ${BADGE_GRADIENT};
    flex-shrink: 0;
    box-shadow: ${frameBoxShadow};
    position: relative;
    z-index: 1;
    align-self: center;
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

  .text-block {
    width: ${frameSize}px;
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: justify;
    gap: 9px;
    flex: 1;
    justify-content: center;
    position: relative;
    z-index: 1;
  }

  .headline {
    font-size: ${headlineSz}px;
    font-weight: 900;
    color: ${headlineColor};
    line-height: 1.1;
    letter-spacing: -0.5px;
  }

  .accent {
    background: ${BADGE_GRADIENT};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .body-copy {
    font-size: 13px;
    font-weight: 400;
    color: ${bodyColor};
    line-height: 1.55;
  }

  .cta-btn {
    display: inline-flex;
    align-items: center;
    padding: 13px 28px;
    border-radius: 50px;
    font-size: 15px;
    font-weight: 800;
    color: white;
    background: ${BADGE_GRADIENT};
    letter-spacing: 0.2px;
    white-space: nowrap;
    margin-top: 4px;
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
