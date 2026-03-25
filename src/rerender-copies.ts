/**
 * Re-renderiza post-copy-N.html/png para uma ou mais campanhas.
 * Usa a scene image existente — não chama o Whisk.
 *
 * Uso:
 *   npx ts-node src/rerender-copies.ts [campaign-id ...]
 *   npx ts-node src/rerender-copies.ts                      ← usa brief-input.json
 *   npx ts-node src/rerender-copies.ts 001-restaurant 002-onde-acontece
 */
import * as path from 'path'
import * as fs from 'fs-extra'
import { CampaignBrief, CopyBlock } from './types'
import { renderPost } from './renderer'
import { exportPNG } from './screenshot'
import { pushToReplit } from './replit-sync'

function log(step: string, msg: string) {
  const ts = new Date().toISOString().replace('T', ' ').slice(0, 19)
  console.log(`[${ts}] [${step}] ${msg}`)
}

async function rerenderCampaign(id: string) {
  const campaignDir = path.resolve(`outputs/campaigns/${id}`)
  const briefPath = path.join(campaignDir, 'brief.json')

  if (!await fs.pathExists(briefPath)) {
    console.error(`Brief não encontrado: ${briefPath}`)
    return
  }

  const brief: CampaignBrief = await fs.readJson(briefPath)
  const copies: CopyBlock[] = [brief.copy, ...(brief.copyVariants ?? [])]

  const scenePng = path.join(campaignDir, 'scene.png')
  const sceneWebp = path.join(campaignDir, 'scene.webp')
  const imagePath = await fs.pathExists(scenePng) ? scenePng : sceneWebp

  if (!await fs.pathExists(imagePath)) {
    console.error(`Imagem não encontrada em ${campaignDir}`)
    return
  }

  log(id, `${copies.length} copies | template: ${brief.visual.template ?? 'overlay'}`)

  for (let i = 0; i < copies.length; i++) {
    const version = `post-copy-${i + 1}`
    const variantBrief = { ...brief, copy: copies[i] }

    log(id, `Rendering ${version} — "${copies[i].headline}"`)
    const htmlPath = await renderPost(variantBrief, imagePath, version)
    const pngPath = htmlPath.replace('.html', '.png')
    await exportPNG(htmlPath, pngPath)
    log(id, `Saved ${version}.png`)

    // Upload first copy to Replit
    if (i === 0) {
      try {
        const html = await fs.readFile(htmlPath, 'utf8')
        const { editorUrl } = await pushToReplit(html)
        log(id, `Replit: ${editorUrl.slice(0, 60)}...`)
      } catch {
        // non-fatal
      }
    }
  }

  log(id, `Done → ${campaignDir}`)
}

async function main() {
  let ids = process.argv.slice(2)

  if (ids.length === 0) {
    const brief = await fs.readJson('brief-input.json')
    ids = [brief.id]
  }

  for (const id of ids) {
    await rerenderCampaign(id)
    console.log()
  }
}

main().catch(console.error)