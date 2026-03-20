import * as dotenv from 'dotenv'
import * as fs from 'fs-extra'
import * as path from 'path'
import { Whisk } from '@rohitaryal/whisk-api'

dotenv.config()

export async function generateSceneImage(prompt: string, campaignId: string): Promise<string> {
  const cookie = process.env.COOKIE
  if (!cookie) throw new Error('COOKIE not set in .env')

  const outputDir = path.resolve(`outputs/campaigns/${campaignId}`)
  await fs.ensureDir(outputDir)

  const whisk = new Whisk(cookie)

  console.log(`[whisk] Creating project vivr-${campaignId}...`)
  const project = await whisk.newProject(`vivr-${campaignId}`)

  console.log(`[whisk] Generating image...`)
  const media = await project.generateImage({
    prompt,
    aspectRatio: 'IMAGE_ASPECT_RATIO_PORTRAIT',
  })

  const savedPath = media.save(outputDir)

  // rename to scene.webp regardless of original filename
  const ext = path.extname(savedPath)
  const finalPath = path.join(outputDir, `scene${ext}`)
  if (savedPath !== finalPath) {
    await fs.move(savedPath, finalPath, { overwrite: true })
  }

  console.log(`[whisk] Image saved at ${finalPath}`)
  return finalPath
}