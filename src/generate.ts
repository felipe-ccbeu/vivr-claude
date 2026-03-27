import * as fs from 'fs-extra'
import * as path from 'path'
import { CampaignBrief } from './types'
import { ContentJSON } from './content-schema'
import { generateSceneImage } from './whisk-client'
import { renderFromContent, TEMPLATE_SIZE, FORMAT_TEMPLATE } from './renderer'
import { exportPNG } from './screenshot'
import { DEFAULT_REFS } from './config'
import { pushToReplit } from './replit-sync'

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

  // 2. Generate scene image via Whisk (once, shared across all formats/copies)
  log('whisk', `Generating scene image...`)
  const refs = { ...DEFAULT_REFS, ...brief.visual.refs }
  await generateSceneImage(brief.visual.whiskPrompt, brief.id, refs)
  log('whisk', `scene saved — referenced relatively by HTML`)

  // 3. Determine formats to generate (default: feed only)
  const formats = brief.visual.formats ?? ['feed']

  for (const format of formats) {
    const template = (brief.visual.template ?? FORMAT_TEMPLATE[format] ?? 'split')
    const size = TEMPLATE_SIZE[template] ?? { width: 540, height: 675 }

    const outDir = formats.length === 1
      ? campaignDir
      : path.join(campaignDir, format)
    await fs.ensureDir(outDir)

    // imagePath: relative from outDir to scene file
    const relDepth = formats.length === 1 ? '' : '../'
    const imagePath = `${relDepth}scene.png`

    // 4. Build and save content.json (thin — only copy data)
    const content = briefToContent(brief, template, imagePath)
    const contentFile = path.join(outDir, `content-${format}.json`)
    await fs.writeJson(contentFile, content, { spaces: 2 })
    log(format, `content-${format}.json saved`)

    // 5. Render HTML from content
    log(format, `Rendering ${content.variants.length} copies (${size.width}×${size.height})...`)
    const htmlPaths = await renderFromContent(content, outDir)

    // 6. Screenshot each HTML → PNG
    for (let i = 0; i < htmlPaths.length; i++) {
      const htmlPath = htmlPaths[i]
      const pngPath = htmlPath.replace('.html', '.png')
      log('screenshot', `Exporting ${format}/post-copy-${i + 1}.png...`)
      await exportPNG(htmlPath, pngPath, size)

      // Push first copy of feed to Replit editor
      if (i === 0 && format === 'feed') {
        try {
          const html = await fs.readFile(htmlPath, 'utf8')
          log('replit', 'Uploading post-copy-1 to visual editor...')
          const { editorUrl } = await pushToReplit(html)
          log('replit', `Open editor: ${editorUrl}`)
        } catch (err) {
          log('replit', `Upload skipped — ${(err as Error).message}`)
        }
      }
    }
  }

  log('done', `Campaign "${brief.id}" complete → ${campaignDir}`)
}
