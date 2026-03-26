import * as fs from 'fs-extra'
import * as path from 'path'
import { CampaignBrief } from './types'
import { ContentJSON, CopyVariant, TemplateName } from './content-schema'
import { buildOverlay } from './templates/overlay'
import { buildSplit } from './templates/split'
import { buildFrame } from './templates/frame'
import { buildPhoneFloat } from './templates/phone-float'
import { buildPhoneTilt } from './templates/phone-tilt'
import { buildStory } from './templates/story'
import { getStyleConfig, StyleConfig } from './styles'

/** Canvas size per template */
export const TEMPLATE_SIZE: Record<string, { width: number; height: number }> = {
  overlay:       { width: 540, height: 675 },
  split:         { width: 540, height: 675 },
  frame:         { width: 540, height: 675 },
  'phone-float': { width: 540, height: 675 },
  'phone-tilt':  { width: 540, height: 675 },
  story:         { width: 540, height: 960 },
}

/** Default template per format */
const FORMAT_TEMPLATE: Record<string, string> = {
  feed:  'split',
  story: 'story',
}

/** Pure synchronous: apply a template to a single variant, return HTML string */
function applyTemplate(templateName: TemplateName, variant: CopyVariant, imageSrc: string, styleConfig: StyleConfig): string {
  switch (templateName) {
    case 'split':       return buildSplit(variant, imageSrc, styleConfig)
    case 'frame':       return buildFrame(variant, imageSrc, styleConfig)
    case 'phone-float': return buildPhoneFloat(variant, imageSrc, styleConfig)
    case 'phone-tilt':  return buildPhoneTilt(variant, imageSrc, styleConfig)
    case 'story':       return buildStory(variant, imageSrc, styleConfig)
    default:            return buildOverlay(variant, imageSrc, styleConfig)
  }
}

/**
 * Primary render entry point — reads ContentJSON, writes post-copy-N.html for each variant.
 * Returns list of written HTML file paths.
 */
export async function renderFromContent(content: ContentJSON, outDir: string): Promise<string[]> {
  await fs.ensureDir(outDir)
  const size = TEMPLATE_SIZE[content.template] ?? { width: 540, height: 675 }
  const styleConfig = getStyleConfig(content.designVariation)
  const htmlPaths: string[] = []

  console.log(`[renderer] Using design variation: ${styleConfig.slug}`)

  for (let i = 0; i < content.variants.length; i++) {
    const variant = content.variants[i]
    const html = applyTemplate(content.template, variant, content.imagePath, styleConfig)
    const htmlPath = path.join(outDir, `post-copy-${i + 1}.html`)
    await fs.writeFile(htmlPath, html, 'utf8')
    console.log(`[renderer] HTML saved at ${htmlPath}`)
    htmlPaths.push(htmlPath)
  }

  return htmlPaths
}

/**
 * Backward-compat wrapper — kept for rerender.ts / rerender-copies.ts.
 * @param imageSrc  Relative path to the image from the HTML file location
 * @param outDir    Directory where the HTML will be saved
 */
export async function renderPost(
  brief: CampaignBrief,
  imageSrc: string,
  filename: string,
  outDir: string,
  templateOverride?: string
): Promise<string> {
  await fs.ensureDir(outDir)

  const template = (templateOverride ?? brief.visual.template ?? 'split') as TemplateName
  const html = applyTemplate(template, brief.copy, imageSrc)

  const htmlPath = path.join(outDir, `${filename}.html`)
  await fs.writeFile(htmlPath, html, 'utf8')
  console.log(`[renderer] HTML saved at ${htmlPath}`)
  return htmlPath
}

export { FORMAT_TEMPLATE }
