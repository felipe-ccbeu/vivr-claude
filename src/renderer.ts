import * as fs from 'fs-extra'
import * as path from 'path'
import { CampaignBrief } from './types'
import { buildOverlay } from './templates/overlay'
import { buildSplit } from './templates/split'
import { buildFrame } from './templates/frame'
import { buildPhoneFloat } from './templates/phone-float'
import { buildPhoneTilt } from './templates/phone-tilt'

export async function renderPost(brief: CampaignBrief, imagePath: string, filename = 'post'): Promise<string> {
  const outputDir = path.resolve(`outputs/campaigns/${brief.id}`)
  await fs.ensureDir(outputDir)

  const imageBuffer = await fs.readFile(imagePath)
  const imageBase64 = imageBuffer.toString('base64')
  const imageMime = imagePath.endsWith('.webp') ? 'image/webp' : 'image/png'
  const imageDataUrl = `data:${imageMime};base64,${imageBase64}`

  const template = brief.visual.template ?? 'overlay'

  let html: string
  if (template === 'split') {
    html = buildSplit(brief, imageDataUrl)
  } else if (template === 'frame') {
    html = buildFrame(brief, imageDataUrl)
  } else if (template === 'phone-float') {
    html = buildPhoneFloat(brief, imageDataUrl)
  } else if (template === 'phone-tilt') {
    html = buildPhoneTilt(brief, imageDataUrl)
  } else {
    html = buildOverlay(brief, imageDataUrl)
  }

  const htmlPath = path.join(outputDir, `${filename}.html`)
  await fs.writeFile(htmlPath, html, 'utf8')
  console.log(`[renderer] HTML saved at ${htmlPath}`)
  return htmlPath
}