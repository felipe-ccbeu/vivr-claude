import { CopyVariant } from '../content-schema'
import { StyleConfig } from '../styles'
import { FONT_LINK, highlightAccentWord } from './shared'

/**
 * SPLIT — imagem ocupa o topo (370px), painel de texto escuro ocupa o rodapé (305px).
 * Hook aparece como tag translúcida sobre a imagem.
 * Layout limpo, tipografia grande, CTA alinhado à esquerda.
 *
 * Supports all design variations via StyleConfig parameter.
 */
export function buildSplit(variant: CopyVariant, imageSrc: string, styleConfig: StyleConfig): string {
  const headlineHtml = highlightAccentWord(variant.headline, variant.accentWord)

  // Build vignette gradient from config
  const vignetteStops = styleConfig.visual.vignette?.stops
    .map(stop => `${stop.color} ${stop.position}`)
    .join(', ') || 'rgba(0,0,0,0) 42%, rgba(0,0,0,0.55) 72%, rgba(13,13,13,1) 100%'

  const vignetteDirection = styleConfig.visual.vignette?.direction || 'to bottom'

  // Build accent word styles
  let accentStyles = ''
  if (styleConfig.visual.accentWordStyle === 'gradient') {
    accentStyles = `
      background: ${styleConfig.colors.accentWord};
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    `
  } else if (styleConfig.visual.accentWordStyle === 'glow') {
    accentStyles = `
      color: ${styleConfig.colors.accentWord};
      filter: drop-shadow(0 0 8px ${styleConfig.colors.accentWord});
    `
  } else if (styleConfig.visual.accentWordStyle === 'underline') {
    accentStyles = `
      color: ${styleConfig.colors.accentWord};
      text-decoration: underline;
    `
  } else {
    accentStyles = `color: ${styleConfig.colors.accentWord};`
  }

  // Build glow effects for CTA if applicable
  let ctaGlowShadow = ''
  if (styleConfig.cta.boxShadow) {
    ctaGlowShadow = `box-shadow: ${styleConfig.cta.boxShadow};`
  } else {
    ctaGlowShadow = `box-shadow: 0 2px 8px rgba(0,0,0,0.1);`
  }

  // Build separator line gradient (for dark-bold style)
  let separatorGradient = 'linear-gradient(90deg, rgba(249,112,64,0.6) 0%, rgba(155,93,229,0.6) 50%, rgba(38,198,218,0.3) 100%)'
  if (styleConfig.slug === 'minimal-clean') {
    separatorGradient = `linear-gradient(90deg, ${styleConfig.colors.primary} 0%, ${styleConfig.colors.primary} 100%)`
  } else if (styleConfig.slug === 'high-contrast') {
    separatorGradient = `linear-gradient(90deg, ${styleConfig.colors.borders} 0%, ${styleConfig.colors.borders} 100%)`
  } else if (styleConfig.slug === 'futuristic') {
    separatorGradient = `linear-gradient(90deg, ${styleConfig.colors.primary} 0%, ${styleConfig.colors.secondary} 100%)`
  }

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
${FONT_LINK}
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { width: 540px; height: 675px; overflow: hidden; font-family: 'Nunito', sans-serif; background: #1A1030; }

  .post-wrapper {
    width: 540px;
    height: 675px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  /* ── IMAGE SECTION ── */
  .img-section {
    position: relative;
    width: 540px;
    height: 370px;
    flex-shrink: 0;
    overflow: hidden;
  }

  .img-section img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 65%;
    display: block;
  }

  /* Vignette overlay */
  .img-vignette {
    position: absolute;
    inset: 0;
    background: linear-gradient(${vignetteDirection}, ${vignetteStops});
  }

  /* Hook tag */
  .hook-tag {
    position: absolute;
    top: 18px;
    left: 20px;
    background: ${styleConfig.visual.hookTag?.background || 'rgba(0,0,0,0.62)'};
    ${styleConfig.visual.hookTag?.backdropFilter ? `backdrop-filter: ${styleConfig.visual.hookTag.backdropFilter};` : ''}
    ${styleConfig.visual.hookTag?.backdropFilter ? `-webkit-backdrop-filter: ${styleConfig.visual.hookTag.backdropFilter};` : ''}
    border: ${styleConfig.visual.hookTag?.border || '1px solid rgba(255,255,255,0.18)'};
    border-radius: 20px;
    padding: 7px 15px;
    font-size: ${styleConfig.typography.hook?.size || '11.5px'};
    font-weight: ${styleConfig.typography.hook?.weight || 700};
    color: ${styleConfig.colors.textPrimary};
    letter-spacing: ${styleConfig.typography.hook?.spacing || '0.15px'};
    max-width: 310px;
    line-height: ${styleConfig.typography.hook?.lineHeight || 1.35};
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
    background: ${styleConfig.colors.primary};
    letter-spacing: 0.4px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.2);
  }

  /* ── TEXT SECTION ── */
  .text-section {
    flex: 1;
    background: #1A1030;
    padding: ${styleConfig.safeZone.topBuffer} ${styleConfig.safeZone.sidePadding} ${styleConfig.safeZone.bottomBuffer};
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-top: 1.5px solid transparent;
    background-clip: padding-box;
    position: relative;
  }

  .text-section::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1.5px;
    background: ${separatorGradient};
  }

  /* Headline */
  .headline {
    font-size: ${styleConfig.typography.headline.size};
    font-weight: ${styleConfig.typography.headline.weight};
    color: ${styleConfig.colors.textPrimary};
    line-height: ${styleConfig.typography.headline.lineHeight};
    letter-spacing: ${styleConfig.typography.headline.spacing};
    ${styleConfig.typography.headline.textShadow ? `text-shadow: ${styleConfig.typography.headline.textShadow};` : ''}
  }

  /* Accent word */
  .accent {
    ${accentStyles}
  }

  /* Body copy */
  .body-copy {
    font-size: ${styleConfig.typography.body.size};
    font-weight: ${styleConfig.typography.body.weight};
    color: ${styleConfig.colors.textSecondary};
    line-height: ${styleConfig.typography.body.lineHeight};
    margin-top: 11px;
    max-width: ${styleConfig.safeZone.maxContentWidth};
    letter-spacing: ${styleConfig.typography.body.spacing};
  }

  /* CTA button — mandatory pill style with complete brand gradient */
  .cta-btn {
    display: inline-flex;
    align-items: center;
    padding: 13px 28px;
    border-radius: 100px;
    font-size: ${styleConfig.typography.cta.size};
    font-weight: 800;
    color: white;
    background: linear-gradient(135deg, #89c7fe 0%, #8bfbd1 20%, #ae90fb 45%, #f599b5 70%, #fdd38a 100%);
    letter-spacing: ${styleConfig.typography.cta.spacing};
    white-space: nowrap;
    align-self: flex-start;
    min-height: 48px;
    box-shadow: 0 4px 12px rgba(137,199,254,0.25);
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
