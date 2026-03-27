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
import { buildLightArc } from './templates/light-arc'
import { buildCinematic } from './templates/cinematic'

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   RENDER METADATA — para auditoria e versionamento
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export interface RenderMeta {
  campaignId: string
  template: TemplateName
  designVariation: string
  variantIndex: number
  generatedAt: string // ISO 8601
}

export interface RenderOptions {
  meta?: RenderMeta
  imageBaseDir?: string  // Optional: base directory where imagePath is relative to. If provided, recalculates imageSrc relative to outDir
}

const ALL_TEMPLATES = ['overlay', 'split', 'frame', 'phone-float', 'phone-tilt', 'light-arc', 'cinematic'] as const

/** Canvas size per template */
export const TEMPLATE_SIZE: Record<string, { width: number; height: number }> = {
  overlay:       { width: 540, height: 675 },
  split:         { width: 540, height: 675 },
  frame:         { width: 540, height: 675 },
  'phone-float': { width: 540, height: 675 },
  'phone-tilt':  { width: 540, height: 675 },
  story:         { width: 540, height: 960 },
  'light-arc': { width: 540, height: 675 },
  'cinematic': { width: 540, height: 675 },
}

/** Default template per format */
const FORMAT_TEMPLATE: Record<string, string> = {
  feed:  'split',
  story: 'story',
}

/**
 * Injeta metadata de render no HTML para auditoria/versionamento.
 * Adiciona: HTML comment + <meta> tag.
 */
function injectMeta(html: string, meta: RenderMeta): string {
  const json = JSON.stringify(meta)
  const comment = `<!-- VIVR_META: ${json} -->\n`
  const metaTag = `<meta name="vivr-campaign" content='${json}'>`

  // Insert comment before <!DOCTYPE
  const withComment = html.replace('<!DOCTYPE html>', `${comment}<!DOCTYPE html>`)

  // Insert meta tag after <head>
  return withComment.replace('<head>', `<head>\n  ${metaTag}`)
}

/** Pure synchronous: apply a template to a single variant, return HTML string */
function applyTemplate(templateName: TemplateName, variant: CopyVariant, imageSrc: string, styleConfig: StyleConfig): string {
  switch (templateName) {
    case 'split':       return buildSplit(variant, imageSrc, styleConfig)
    case 'frame':       return buildFrame(variant, imageSrc, styleConfig)
    case 'phone-float': return buildPhoneFloat(variant, imageSrc, styleConfig)
    case 'phone-tilt':  return buildPhoneTilt(variant, imageSrc, styleConfig)
    case 'story':       return buildStory(variant, imageSrc, styleConfig)
    case 'light-arc':   return buildLightArc(variant, imageSrc, styleConfig)
    case 'cinematic':   return buildCinematic(variant, imageSrc, styleConfig)
    default:            return buildOverlay(variant, imageSrc, styleConfig)
  }
}

/**
 * Primary render entry point — reads ContentJSON, writes post-copy-N.html for each variant.
 * Returns list of written HTML file paths.
 * @param options Optional RenderOptions to inject metadata (campaignId, template, variation, etc.)
 */
export async function renderFromContent(
  content: ContentJSON,
  outDir: string,
  options?: RenderOptions
): Promise<string[]> {
  await fs.ensureDir(outDir)
  const size = TEMPLATE_SIZE[content.template] ?? { width: 540, height: 675 }
  const styleConfig = getStyleConfig(content.designVariation)
  const htmlPaths: string[] = []

  console.log(`[renderer] Using design variation: ${styleConfig.slug}`)

  for (let i = 0; i < content.variants.length; i++) {
    const variant = content.variants[i]

    // Resolve image path relative to outDir (where HTML will be saved)
    let imageSrc = content.imagePath
    if (options?.imageBaseDir) {
      const absImage = path.resolve(options.imageBaseDir, content.imagePath)
      imageSrc = path.relative(outDir, absImage).replace(/\\/g, '/')
    }

    let html = applyTemplate(content.template, variant, imageSrc, styleConfig)

    // Inject metadata if options provided
    if (options?.meta) {
      html = injectMeta(html, {
        ...options.meta,
        variantIndex: i + 1, // Override com o índice real da variante
      })
    }

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
  const styleConfig = getStyleConfig(undefined)

  const html = applyTemplate(template, brief.copy, imageSrc, styleConfig)  

  const htmlPath = path.join(outDir, `${filename}.html`)
  await fs.writeFile(htmlPath, html, 'utf8')
  console.log(`[renderer] HTML saved at ${htmlPath}`)
  return htmlPath
}

export { FORMAT_TEMPLATE }
