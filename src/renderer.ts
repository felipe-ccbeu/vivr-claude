import * as fs from 'fs-extra'
import * as path from 'path'
import { CampaignBrief } from './types'

const BRAND_GRADIENT = 'linear-gradient(135deg, #26b6cd 0%, #80cb5e 33%, #8378b6 66%, #fd8c61 100%)'
const BADGE_GRADIENT = 'linear-gradient(135deg, #f7c948 0%, #f97040 20%, #e94899 45%, #9b5de5 65%, #26c6da 83%, #80e27e 100%)'

function highlightAccentWord(headline: string, accentWord: string): string {
  if (!accentWord) return headline
  const escaped = accentWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return headline.replace(
    new RegExp(`(${escaped})`, 'i'),
    `<span class="accent">$1</span>`
  )
}

export async function renderPost(brief: CampaignBrief, imagePath: string): Promise<string> {
  const outputDir = path.resolve(`outputs/campaigns/${brief.id}`)
  await fs.ensureDir(outputDir)

  const imageBuffer = await fs.readFile(imagePath)
  const imageBase64 = imageBuffer.toString('base64')
  const imageMime = imagePath.endsWith('.webp') ? 'image/webp' : 'image/png'
  const imageDataUrl = `data:${imageMime};base64,${imageBase64}`

  const logoPath = path.resolve('assets/vivr-logo.png')
  let logoDataUrl = ''
  if (await fs.pathExists(logoPath)) {
    const logoBuffer = await fs.readFile(logoPath)
    logoDataUrl = `data:image/png;base64,${logoBuffer.toString('base64')}`
  }

  const headlineHtml = highlightAccentWord(brief.copy.headline, brief.copy.accentWord)

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet">
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
    background-image: url('${imageDataUrl}');
    background-size: cover;
    background-position: center top;
  }

  .overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(8,8,8,0.08) 0%,
      rgba(8,8,8,0.00) 25%,
      rgba(8,8,8,0.45) 52%,
      rgba(8,8,8,0.88) 72%,
      rgba(8,8,8,0.97) 100%
    );
  }

  .content {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    padding: 20px 24px 28px;
  }

  /* TOP ROW */
  .top-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: auto;
  }

  .logo-wrap {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .logo-img {
    width: 52px;
    height: 52px;
    border-radius: 14px;
    object-fit: cover;
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
    margin-top: 4px;
  }

  .speech-bubble {
    background: white;
    border-radius: 16px 16px 4px 16px;
    padding: 10px 14px;
    max-width: 180px;
    font-size: 13px;
    font-weight: 600;
    color: #1a1a1a;
    line-height: 1.35;
    box-shadow: 0 2px 12px rgba(0,0,0,0.15);
  }

  /* BOTTOM CONTENT */
  .bottom {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .headline {
    font-size: 38px;
    font-weight: 900;
    color: white;
    line-height: 1.1;
    letter-spacing: -0.5px;
  }

  .accent {
    background: ${BRAND_GRADIENT};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .body-copy {
    font-size: 14px;
    font-weight: 400;
    color: rgba(255,255,255,0.58);
    line-height: 1.5;
    max-width: 420px;
  }

  .cta-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 4px;
  }

  .cta-btn {
    display: inline-flex;
    align-items: center;
    padding: 12px 24px;
    border-radius: 50px;
    font-size: 15px;
    font-weight: 800;
    color: white;
    background: ${BRAND_GRADIENT};
    letter-spacing: 0.2px;
    white-space: nowrap;
  }

  .sub-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 600;
    color: rgba(255,255,255,0.65);
  }

  .dot-green {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #80cb5e;
    flex-shrink: 0;
  }
</style>
</head>
<body>
<div class="post-wrapper">
  <div class="bg"></div>
  <div class="overlay"></div>
  <div class="content">
    <div class="top-row">
      <div class="logo-wrap">
        ${logoDataUrl ? `<img class="logo-img" src="${logoDataUrl}" alt="Vivr" />` : ''}
        <span class="badge-free">Grátis</span>
      </div>
      <div class="speech-bubble">${brief.copy.hook}</div>
    </div>
    <div class="bottom">
      <div class="headline">${headlineHtml}</div>
      <div class="body-copy">${brief.copy.body}</div>
      <div class="cta-row">
        <div class="cta-btn">${brief.copy.cta}</div>
        <div class="sub-badge">
          <span class="dot-green"></span>
          É grátis pra começar
        </div>
      </div>
    </div>
  </div>
</div>
</body>
</html>`

  const htmlPath = path.join(outputDir, 'post.html')
  await fs.writeFile(htmlPath, html, 'utf8')
  console.log(`[renderer] HTML saved at ${htmlPath}`)
  return htmlPath
}