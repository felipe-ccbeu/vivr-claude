import * as fs from 'fs-extra'
import * as path from 'path'
import { CampaignBrief } from './types'
import { generateSceneImage } from './whisk-client'
import { renderPost } from './renderer'
import { exportPNG } from './screenshot'
import { DEFAULT_REFS } from './config'
import { pushToReplit } from './replit-sync'

function log(step: string, message: string) {
  const ts = new Date().toISOString().replace('T', ' ').slice(0, 19)
  console.log(`[${ts}] [${step}] ${message}`)
}

export async function generateCampaign(brief: CampaignBrief): Promise<void> {
  const outputDir = path.resolve(`outputs/campaigns/${brief.id}`)
  await fs.ensureDir(outputDir)

  // 1. Save brief
  log('brief', `Saving brief for "${brief.id}"`)
  await fs.writeJson(path.join(outputDir, 'brief.json'), brief, { spaces: 2 })

  // 2. Generate scene image via Whisk
  log('whisk', `Generating scene image...`)
  const refs = { ...DEFAULT_REFS, ...brief.visual.refs }
  const imagePath = await generateSceneImage(brief.visual.whiskPrompt, brief.id, refs)

  // 3. Build copy list: primary + variants
  const copies = [brief.copy, ...(brief.copyVariants ?? [])]
  const files: string[] = []

  for (let i = 0; i < copies.length; i++) {
    const version = `post-copy-${i + 1}`
    const variantBrief = { ...brief, copy: copies[i] }
    log('renderer', `Building HTML ${version} — "${copies[i].headline}"`)
    const htmlPath = await renderPost(variantBrief, imagePath, version)
    const pngPath = htmlPath.replace('.html', '.png')
    log('screenshot', `Exporting ${version}.png...`)
    await exportPNG(htmlPath, pngPath)
    files.push(`${version}.html | ${version}.png`)

    // Push first copy to Replit editor so the user can edit the layout
    if (i === 0) {
      try {
        const html = await fs.readFile(htmlPath, 'utf8')
        log('replit', 'Uploading post-copy-1 to visual editor...')
        const { editorUrl } = await pushToReplit(html)
        log('replit', `Open editor: ${editorUrl}`)
        log('replit', `After editing, run: npx ts-node src/rerender-from-edited.ts ${brief.id}`)
      } catch (err) {
        log('replit', `Upload skipped — ${(err as Error).message}`)
      }
    }
  }

  log('done', `Campaign "${brief.id}" complete → ${outputDir}`)
  log('done', `Files: brief.json | scene.webp | ${files.join(' | ')}`)
}