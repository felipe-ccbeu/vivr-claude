/**
 * Re-renders copy variants using the HTML edited in the Replit visual editor.
 *
 * Usage:
 *   npx ts-node src/rerender-from-edited.ts [campaign-id]
 *
 * If campaign-id is omitted, reads from brief-input.json.
 *
 * Flow:
 *   1. GETs the current HTML from https://ad-creative-suite.replit.app/api/html
 *   2. For each copy variant in brief.json, replaces data-slot content
 *   3. Saves post-edited-copy-N.html + post-edited-copy-N.png
 */
import * as fs from 'fs-extra'
import * as path from 'path'
import { CampaignBrief, CopyBlock } from './types'
import { exportPNG } from './screenshot'
import { highlightAccentWord } from './templates/shared'
import { fetchFromReplit } from './replit-sync'

function log(step: string, msg: string) {
  const ts = new Date().toISOString().replace('T', ' ').slice(0, 19)
  console.log(`[${ts}] [${step}] ${msg}`)
}

/**
 * Replaces the innerHTML of the first element with data-slot="<slot>".
 * Handles any tag name and preserves all existing attributes.
 */
function replaceSlot(html: string, slot: string, content: string): string {
  return html.replace(
    new RegExp(`(<[a-z][a-z0-9]*[^>]*\\bdata-slot="${slot}"[^>]*>)[\\s\\S]*?(<\\/[a-z][a-z0-9]*>)`, 'i'),
    `$1${content}$2`
  )
}

async function main() {
  const campaignId =
    process.argv[2] ??
    (JSON.parse(await fs.readFile('brief-input.json', 'utf8')) as CampaignBrief).id

  const briefPath = path.resolve(`outputs/campaigns/${campaignId}/brief.json`)
  if (!(await fs.pathExists(briefPath))) {
    console.error(`Brief not found: ${briefPath}`)
    process.exit(1)
  }

  const brief: CampaignBrief = await fs.readJson(briefPath)
  const copies: CopyBlock[] = [brief.copy, ...(brief.copyVariants ?? [])]

  log('replit', 'Fetching edited HTML...')
  const baseHtml = await fetchFromReplit()
  log('replit', `HTML received (${baseHtml.length} chars)`)

  const outputDir = path.resolve(`outputs/campaigns/${campaignId}`)

  for (let i = 0; i < copies.length; i++) {
    const copy = copies[i]
    const version = `post-edited-copy-${i + 1}`

    log('renderer', `Injecting copy ${i + 1} — "${copy.headline}"`)

    let html = baseHtml
    html = replaceSlot(html, 'headline', highlightAccentWord(copy.headline, copy.accentWord))
    html = replaceSlot(html, 'hook', copy.hook)
    html = replaceSlot(html, 'body', copy.body ?? '')
    html = replaceSlot(html, 'cta', copy.cta)

    const htmlPath = path.join(outputDir, `${version}.html`)
    await fs.writeFile(htmlPath, html, 'utf8')
    log('renderer', `Saved ${version}.html`)

    const pngPath = htmlPath.replace('.html', '.png')
    await exportPNG(htmlPath, pngPath)
    log('screenshot', `Saved ${version}.png`)
  }

  log('done', `${copies.length} variants → outputs/campaigns/${campaignId}/post-edited-copy-*.png`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})