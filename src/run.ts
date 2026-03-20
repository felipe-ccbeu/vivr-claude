import * as fs from 'fs-extra'
import * as path from 'path'
import { generateCampaign } from './generate'
import { CampaignBrief } from './types'

const inputPath = path.resolve('brief-input.json')

async function main() {
  if (!await fs.pathExists(inputPath)) {
    console.error(`[run] brief-input.json not found at ${inputPath}`)
    process.exit(1)
  }

  const brief: CampaignBrief = await fs.readJson(inputPath)
  console.log(`[run] Starting campaign: ${brief.id}`)
  await generateCampaign(brief)
}

main().catch(err => {
  console.error('Error:', err.message)
  process.exit(1)
})