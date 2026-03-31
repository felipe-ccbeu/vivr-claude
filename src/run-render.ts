/**
 * run-render.ts — render + screenshot only, no Whisk call.
 *
 * Old format (ContentJSON):
 *   npx ts-node src/run-render.ts outputs/campaigns/009-slug/content-feed.json
 *
 * New format (ContentFeedV2):
 *   npx ts-node src/run-render.ts outputs/campaigns/012-slug/content-feed.json
 */
import * as fs from 'fs-extra'
import * as path from 'path'
import { ContentJSON, ContentFeedV2, isV2 } from './content-schema'
import { renderFromContent, renderFromContentV2, TEMPLATE_SIZE } from './renderer'
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

  const content: ContentJSON | ContentFeedV2 = await fs.readJson(absPath)
  const outDir = path.dirname(absPath)

  if (isV2(content)) {
    // New multi-template flow
    console.log(`[run-render] Campaign: ${content.campaignId} | V2 format | Items: ${content.items.length}`)
    const results = await renderFromContentV2(content, outDir)

    for (const { htmlPath, pngPath, size } of results) {
      await exportPNG(htmlPath, pngPath, size)
      console.log(`[run-render] PNG saved: ${path.basename(pngPath)}`)
    }

    console.log(`[run-render] Done — ${results.length} files rendered.`)
  } else {
    // Legacy format
    const size = TEMPLATE_SIZE[content.template] ?? { width: 540, height: 675 }
    console.log(`[run-render] Campaign: ${content.campaignId} | Template: ${content.template} | Variants: ${content.variants.length}`)

    const htmlPaths = await renderFromContent(content, outDir)

    for (const htmlPath of htmlPaths) {
      const pngPath = htmlPath.replace('.html', '.png')
      await exportPNG(htmlPath, pngPath, size)
      console.log(`[run-render] PNG saved: ${path.basename(pngPath)}`)
    }

    console.log(`[run-render] Done — ${htmlPaths.length} files rendered.`)
  }
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
