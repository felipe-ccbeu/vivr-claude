import { CopyVariant } from '../content-schema'
import { StyleConfig } from '../styles'
import { FONT_LINK, BADGE_GRADIENT, STORY_HEIGHT } from './shared'

/**
 * BOLD-TEXT — Tipografia Oversized (540×675px)
 * Zero imagem. Fundo gradiente badge. Hook pill. Accent gigante 116px.
 * Ideal para: Scroll-stopping power, type-first design, scroll ads.
 */
export function buildBoldText(variant: CopyVariant, _imageSrc: string, _styleConfig: StyleConfig, isStory = false): string {
  const H = isStory ? STORY_HEIGHT : 675
  const accentSz = isStory ? 130 : 116
  const headlineTopSz = isStory ? 60 : 52

  // Split headline around accentWord → before + accent + after
  const accent = variant.accentWord ?? ''
  const accentIdx = accent ? variant.headline.toLowerCase().indexOf(accent.toLowerCase()) : -1
  const headlineBefore = accentIdx >= 0 ? variant.headline.slice(0, accentIdx).trim() : variant.headline
  const headlineAfter  = accentIdx >= 0 ? variant.headline.slice(accentIdx + accent.length).trim() : ''
  const accentDisplay  = accentIdx >= 0 ? variant.headline.slice(accentIdx, accentIdx + accent.length) : accent

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
${FONT_LINK}
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { width: 540px; height: ${H}px; overflow: hidden; font-family: 'Nunito', sans-serif; }

  .post-wrapper {
    width: 540px;
    height: ${H}px;
    background: ${BADGE_GRADIENT};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 28px;
    position: relative;
    overflow: hidden;
  }

  .content {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 16px;
    max-width: 460px;
  }

  .hook {
    font-size: 11px;
    font-weight: 800;
    color: rgba(255,255,255,0.95);
    text-transform: uppercase;
    letter-spacing: 3px;
    background: rgba(255,255,255,0.18);
    border: 1px solid rgba(255,255,255,0.35);
    border-radius: 100px;
    padding: 5px 16px;
  }

  .headline {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
    line-height: 1;
  }

  .headline-top {
    font-size: ${headlineTopSz}px;
    font-weight: 900;
    color: #ffffff;
    letter-spacing: -1px;
    text-shadow: 0 2px 10px rgba(0,0,0,0.15);
    line-height: 1.1;
  }

  .accent {
    font-size: ${accentSz}px;
    font-weight: 900;
    color: #ffffff;
    letter-spacing: -5px;
    line-height: 0.88;
    text-shadow: 0 4px 20px rgba(0,0,0,0.18);
  }

  .body-copy {
    font-size: 14px;
    font-weight: 600;
    color: rgba(255,255,255,0.92);
    line-height: 1.55;
    letter-spacing: 0.1px;
    max-width: 360px;
    text-shadow: 0 1px 6px rgba(0,0,0,0.2);
  }

  .cta-btn {
    display: inline-flex;
    align-items: center;
    padding: 14px 32px;
    border-radius: 100px;
    font-size: 15px;
    font-weight: 900;
    color: #1a0a2e;
    background: #ffffff;
    letter-spacing: 0.5px;
    white-space: nowrap;
    cursor: pointer;
    box-shadow: 0 6px 20px rgba(0,0,0,0.18);
  }

  .decor-dot {
    position: absolute;
    border-radius: 50%;
  }
  .decor-1 {
    width: 200px; height: 200px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    top: -60px; right: -60px;
  }
  .decor-2 {
    width: 140px; height: 140px;
    background: rgba(0,0,0,0.06);
    bottom: -40px; left: -40px;
  }
</style>
</head>
<body>
<div class="post-wrapper">
  <div class="decor-dot decor-1"></div>
  <div class="decor-dot decor-2"></div>

  <div class="content">
    <div class="hook" data-slot="hook">${variant.hook}</div>
    <div class="headline">
      ${headlineBefore ? `<span class="headline-top">${headlineBefore}</span>` : ''}
      <span class="accent">${accentDisplay}</span>
      ${headlineAfter ? `<span class="headline-top">${headlineAfter}</span>` : ''}
    </div>
    <div class="body-copy" data-slot="body">${variant.body}</div>
    <div class="cta-btn" data-slot="cta">${variant.cta}</div>
  </div>
</div>
</body>
</html>`
}
