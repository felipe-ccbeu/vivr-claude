/**
 * run-render.ts — render + screenshot only, no Whisk call.
 *
 * Use when scene.webp already exists and you only want to apply new copy:
 *   npx ts-node src/run-render.ts outputs/campaigns/009-slug/content-feed.json
 */
import * as fs from 'fs-extra'
import * as path from 'path'
import { ContentJSON } from './content-schema'
import { renderFromContent, TEMPLATE_SIZE } from './renderer'
import { exportPNG } from './screenshot'

async function main() {
  const contentPath = process.argv[2]
  if (!contentPath) {
    console.error('Usage: npx ts-node src/run-render.ts <path/to/content-feed.json>')
    process.exit(1)
  }

  const absPath = path.resolve(contentPath)
  if (!await fs.pathExists(absPath)) {
    console.error(`File not found: ${absPath}`)
    process.exit(1)
  }

  const content: ContentJSON = await fs.readJson(absPath)
  const outDir = path.dirname(absPath)
  const size = TEMPLATE_SIZE[content.template] ?? { width: 540, height: 675 }

  console.log(`[run-render] Campaign: ${content.campaignId} | Template: ${content.template} | Variants: ${content.variants.length}`)

  const htmlPaths = await renderFromContent(content, outDir)

  for (const htmlPath of htmlPaths) {
    const pngPath = htmlPath.replace('.html', '.png')
    await exportPNG(htmlPath, pngPath, size)
    console.log(`[run-render] PNG saved: ${pngPath}`)
  }

  console.log(`[run-render] Done — ${htmlPaths.length} files rendered.`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
