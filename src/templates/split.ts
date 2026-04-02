import { CopyVariant } from '../content-schema'
import { StyleConfig } from '../styles'
import { FONT_LINK, BADGE_GRADIENT, highlightAccentWord, STORY_HEIGHT, STORY_SAFE_BOTTOM } from './shared'

export function buildSplit(variant: CopyVariant, imageSrc: string, styleConfig: StyleConfig, isStory = false): string {
  const headlineHtml = highlightAccentWord(variant.headline, variant.accentWord)
  const isLight = styleConfig.colors.background === '#ffffff'
  const H = isStory ? STORY_HEIGHT : 675
  const imgH = isStory ? 560 : 370
  const textPadBottom = isStory ? STORY_SAFE_BOTTOM : 26
  const headlineSz = isStory ? 42 : 36

  const bodyBg           = isLight ? '#ffffff' : '#1A1030'
  const hookBg           = '#ffffff'
  const hookBorder       = isLight ? '1px solid rgba(0,0,0,0.1)' : 'none'
  const hookColor        = '#1a1030'
  const textSectionBg    = isLight ? '#ffffff' : '#1A1030'
  const separatorBg      = isLight ? BADGE_GRADIENT : 'linear-gradient(90deg, rgba(249,112,64,0.6) 0%, rgba(155,93,229,0.6) 50%, rgba(38,198,218,0.3) 100%)'
  const headlineColor    = isLight ? '#1a1030' : '#ffffff'
  const bodyColor        = isLight ? 'rgba(26,16,48,0.6)' : 'rgba(255,255,255,0.70)'
  const ctaShadow        = isLight ? '0 4px 16px rgba(233,72,153,0.25)' : '0 4px 16px rgba(233,72,153,0.3)'

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
${FONT_LINK}
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { width: 540px; height: ${H}px; overflow: hidden; font-family: 'Nunito', sans-serif; background: ${bodyBg}; }

  .post-wrapper {
    width: 540px;
    height: ${H}px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .img-section {
    position: relative;
    width: 540px;
    height: ${imgH}px;
    flex-shrink: 0;
    overflow: hidden;
  }

  .img-section img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 25%;
    display: block;
  }

  .img-vignette { display: none; }

  .hook-tag {
    position: absolute;
    top: 18px;
    left: 20px;
    background: ${hookBg};
    border: ${hookBorder};
    border-radius: 20px;
    padding: 7px 15px;
    font-size: 11.5px;
    font-weight: 700;
    color: ${hookColor};
    letter-spacing: 0.15px;
    max-width: 310px;
    line-height: 1.35;
    box-shadow: 0 2px 10px rgba(0,0,0,0.15);
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
    background: ${BADGE_GRADIENT};
    letter-spacing: 0.4px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.2);
  }

  .text-section {
    flex: 1;
    background: ${textSectionBg};
    padding: 20px 36px ${textPadBottom}px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
  }

  .text-section::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1.5px;
    background: ${separatorBg};
  }

  .headline {
    font-size: ${headlineSz}px;
    font-weight: 900;
    color: ${headlineColor};
    line-height: 1.08;
    letter-spacing: -0.8px;
  }

  .accent {
    background: ${BADGE_GRADIENT};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .body-copy {
    font-size: 14px;
    font-weight: 500;
    color: ${bodyColor};
    line-height: 1.6;
    margin-top: 11px;
    max-width: 430px;
    letter-spacing: 0.1px;
  }

  .cta-btn {
    display: inline-flex;
    align-items: center;
    padding: 13px 28px;
    border-radius: 100px;
    font-size: 14.5px;
    font-weight: 800;
    color: white;
    background: ${BADGE_GRADIENT};
    letter-spacing: 0.3px;
    white-space: nowrap;
    align-self: flex-start;
    min-height: 48px;
    box-shadow: ${ctaShadow};
  }
</style>
</head>
<body>
<div class="post-wrapper">
  <div class="img-section">
    <img src="${imageSrc}" alt="" />
    <div class="img-vignette"></div>
    <span class="hook-tag" data-slot="hook">${variant.hook}</span>
    <span class="badge-free">Grátis</span>
  </div>
  <div class="text-section">
    <div>
      <div class="headline" data-slot="headline">${headlineHtml}</div>
      <div class="body-copy" data-slot="body">${variant.body}</div>
    </div>
    <div class="cta-btn" data-slot="cta">${variant.cta}</div>
  </div>
</div>
</body>
</html>`
}
