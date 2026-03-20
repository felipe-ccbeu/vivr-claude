import * as fs from 'fs-extra'
import * as path from 'path'
import { CampaignBrief } from './types'
import { generateSceneImage } from './whisk-client'
import { renderPost } from './renderer'
import { exportPNG } from './screenshot'

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
  const imagePath = await generateSceneImage(brief.visual.whiskPrompt, brief.id)

  // 3. Render HTML
  log('renderer', `Building HTML post...`)
  const htmlPath = await renderPost(brief, imagePath)

  // 4. Export PNG
  const pngPath = path.join(outputDir, 'post.png')
  log('screenshot', `Exporting PNG...`)
  await exportPNG(htmlPath, pngPath)

  log('done', `Campaign "${brief.id}" complete → ${outputDir}`)
  log('done', `Files: brief.json | scene.webp | post.html | post.png`)
}