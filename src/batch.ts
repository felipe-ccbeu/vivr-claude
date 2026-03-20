import * as fs from 'fs-extra'
import * as path from 'path'
import { CampaignBrief } from './types'
import { generateCampaign } from './generate'

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function runBatch(briefs: CampaignBrief[]): Promise<void> {
  const results: Array<{ id: string; status: 'success' | 'error'; error?: string; generatedAt: string }> = []

  for (let i = 0; i < briefs.length; i++) {
    const brief = briefs[i]
    console.log(`\n[batch] Processing ${i + 1}/${briefs.length}: ${brief.id}`)

    try {
      await generateCampaign(brief)
      results.push({ id: brief.id, status: 'success', generatedAt: new Date().toISOString() })
    } catch (err: any) {
      console.error(`[batch] Error on "${brief.id}": ${err.message}`)
      results.push({ id: brief.id, status: 'error', error: err.message, generatedAt: new Date().toISOString() })
    }

    if (i < briefs.length - 1) {
      console.log(`[batch] Waiting 3s before next campaign...`)
      await sleep(3000)
    }
  }

  const indexPath = path.resolve('outputs/campaigns/index.json')
  await fs.ensureDir(path.dirname(indexPath))
  await fs.writeJson(indexPath, { generatedAt: new Date().toISOString(), total: briefs.length, campaigns: results }, { spaces: 2 })
  console.log(`\n[batch] Done. Index saved at ${indexPath}`)
}