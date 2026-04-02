import * as fs from 'fs-extra'
import * as path from 'path'
import { CampaignBrief } from './types'
import { ContentJSON } from './content-schema'
import { generateSceneImage, WhiskAspectRatio } from './whisk-client'
import { renderFromContent, TEMPLATE_SIZE, FORMAT_TEMPLATE } from './renderer'
import { exportPNG } from './screenshot'
import { DEFAULT_REFS } from './config'

function log(step: string, message: string) {
  const ts = new Date().toISOString().replace('T', ' ').slice(0, 19)
  console.log(`[${ts}] [${step}] ${message}`)
}

/** Build a thin ContentJSON from a CampaignBrief — no Claude needed */
function briefToContent(brief: CampaignBrief, template: string, imagePath: string): ContentJSON {
  return {
    campaignId: brief.id,
    template: template as ContentJSON['template'],
    imagePath,
    variants: [brief.copy, ...(brief.copyVariants ?? [])],
  }
}

export async function generateCampaign(brief: CampaignBrief): Promise<void> {
  const campaignDir = path.resolve(`outputs/campaigns/${brief.id}`)
  await fs.ensureDir(campaignDir)

  // 1. Save brief (strategic context, kept as audit trail)
  log('brief', `Saving brief for "${brief.id}"`)
  await fs.writeJson(path.join(campaignDir, 'brief.json'), brief, { spaces: 2 })

  // 2. Generate scene image(s) via Whisk
  const refs = { ...DEFAULT_REFS, ...brief.visual.refs }
  const formats = brief.visual.formats ?? ['feed']
  const isStoryOnly = formats.length === 1 && formats[0] === 'story'
  const feedAspect: WhiskAspectRatio = brief.visual.aspectRatio ?? (isStoryOnly ? 'PORTRAIT' : 'SQUARE')

  log('whisk', `Generating scene.png (${feedAspect})...`)
  await generateSceneImage(brief.visual.whiskPrompt, brief.id, refs, feedAspect, 'scene')
  log('whisk', `scene.png saved`)

  if (brief.visual.generateStoryImage && !isStoryOnly) {
    log('whisk', `Generating scene-story.png (PORTRAIT)...`)
    await generateSceneImage(brief.visual.whiskPrompt, brief.id, refs, 'PORTRAIT', 'scene-story')
    log('whisk', `scene-story.png saved`)
  }

  if (brief.visual.generateLandscapeImage) {
    log('whisk', `Generating scene-landscape.png (LANDSCAPE)...`)
    await generateSceneImage(brief.visual.whiskPrompt, brief.id, refs, 'LANDSCAPE', 'scene-landscape')
    log('whisk', `scene-landscape.png saved`)
  }

  // 3. Render via V2 content-feed.json if present, otherwise legacy
  const contentFeedPath = path.resolve('content-feed.json')
  if (await fs.pathExists(contentFeedPath)) {
    const { isV2 } = await import('./content-schema')
    const { renderFromContentV2 } = await import('./renderer')
    const feed = await fs.readJson(contentFeedPath)
    if (isV2(feed)) {
      // Move content-feed.json to campaign dir
      const destFeed = path.join(campaignDir, 'content-feed.json')
      await fs.copy(contentFeedPath, destFeed)
      log('render', `V2 content-feed.json found — rendering ${feed.items.length} items...`)
      const results = await renderFromContentV2(feed, campaignDir)
      for (const { htmlPath, pngPath, size } of results) {
        await exportPNG(htmlPath, pngPath, size)
        log('screenshot', `PNG saved: ${path.relative(campaignDir, pngPath)}`)
      }
      log('done', `Campaign "${brief.id}" complete → ${campaignDir}`)
      return
    }
  }

  // Legacy fallback (no content-feed.json)
  for (const format of formats) {
    const template = (brief.visual.template ?? FORMAT_TEMPLATE[format] ?? 'split')
    const size = TEMPLATE_SIZE[template] ?? { width: 540, height: 675 }

    const outDir = formats.length === 1
      ? campaignDir
      : path.join(campaignDir, format)
    await fs.ensureDir(outDir)

    const relDepth = formats.length === 1 ? '' : '../'
    const imagePath = `${relDepth}scene.png`

    const content = briefToContent(brief, template, imagePath)
    const contentFile = path.join(outDir, `content-${format}.json`)
    await fs.writeJson(contentFile, content, { spaces: 2 })
    log(format, `content-${format}.json saved`)

    log(format, `Rendering ${content.variants.length} copies (${size.width}×${size.height})...`)
    const htmlPaths = await renderFromContent(content, outDir)

    for (let i = 0; i < htmlPaths.length; i++) {
      const htmlPath = htmlPaths[i]
      const pngPath = htmlPath.replace('.html', '.png')
      log('screenshot', `Exporting ${format}/post-copy-${i + 1}.png...`)
      await exportPNG(htmlPath, pngPath, size)
    }
  }

  log('done', `Campaign "${brief.id}" complete → ${campaignDir}`)
}
