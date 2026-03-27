/**
 * Rerenderiza uma campanha já gerada com um ou todos os templates.
 * Usa a scene image existente — não chama o Whisk.
 * Cada execução cria um novo post-vN.html / post-vN.png.
 *
 * Uso:
 *   npx ts-node src/rerender.ts <campaign-id> [template]
 *
 * Exemplos:
 *   npx ts-node src/rerender.ts 003-pratica-real            ← roda todos os templates
 *   npx ts-node src/rerender.ts 003-pratica-real frame
 *   npx ts-node src/rerender.ts 003-pratica-real split
 *   npx ts-node src/rerender.ts 003-pratica-real overlay
 */
import * as path from 'path'
import * as fs from 'fs-extra'
import { CampaignBrief } from './types'
import { renderPost } from './renderer'
import { exportPNG } from './screenshot'

const ALL_TEMPLATES = ['overlay', 'split', 'frame', 'phone-float', 'phone-tilt'] as const
type Template = typeof ALL_TEMPLATES[number]

async function nextVersion(campaignDir: string): Promise<number> {
  const files = await fs.readdir(campaignDir).catch(() => [] as string[])
  const nums = files
    .map(f => { const m = f.match(/^post-v(\d+)\.html$/); return m ? parseInt(m[1]) : 0 })
    .filter(n => n > 0)
  return nums.length > 0 ? Math.max(...nums) + 1 : 1
}

async function renderVersion(
  brief: CampaignBrief,
  imagePath: string,
  campaignDir: string,
  template: Template
): Promise<string> {
  const version = await nextVersion(campaignDir)
  const filename = `post-v${version}`

  brief.visual.template = template
  console.log(`[rerender] v${version} → template: ${template}`)

  const htmlPath = await renderPost(brief, imagePath, filename, campaignDir)
  const pngPath  = htmlPath.replace('.html', '.png')
  await exportPNG(htmlPath, pngPath)

  console.log(`[rerender] Saved → ${pngPath}`)
  return pngPath
}

async function rerender() {
  const [,, id, templateArg] = process.argv

  if (!id) {
    console.error('Uso: npx ts-node src/rerender.ts <campaign-id> [template|all]')
    console.error('Templates disponíveis: overlay | split | frame')
    process.exit(1)
  }

  const campaignDir = path.resolve(`outputs/campaigns/${id}`)
  const briefPath   = path.join(campaignDir, 'brief.json')

  if (!await fs.pathExists(briefPath)) {
    console.error(`Campanha não encontrada: ${campaignDir}`)
    process.exit(1)
  }

  const scenePng  = path.join(campaignDir, 'scene.png')
  const sceneWebp = path.join(campaignDir, 'scene.webp')
  const imagePath = await fs.pathExists(scenePng) ? scenePng : sceneWebp

  if (!await fs.pathExists(imagePath)) {
    console.error(`Imagem não encontrada em ${campaignDir}`)
    process.exit(1)
  }

  const templates: Template[] =
    !templateArg || templateArg === 'all'
      ? [...ALL_TEMPLATES]
      : [templateArg as Template]

  for (const template of templates) {
    // Reload brief each iteration to avoid mutation across loops
    const brief: CampaignBrief = await fs.readJson(briefPath)
    await renderVersion(brief, imagePath, campaignDir, template)
  }

  console.log(`\n[rerender] ${templates.length} versão(ões) gerada(s) em ${campaignDir}`)
}

rerender().catch(console.error)