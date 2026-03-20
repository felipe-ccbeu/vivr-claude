import * as dotenv from 'dotenv'
import * as fs from 'fs-extra'
import * as path from 'path'
import { Whisk } from '@rohitaryal/whisk-api'

dotenv.config()

export interface WhiskRefs {
  subject?: string   // file path or URL
  scene?: string     // file path or URL
  style?: string     // file path or URL
}

function toImageInput(ref: string) {
  if (ref.startsWith('http://') || ref.startsWith('https://')) {
    return { url: ref }
  }
  return { file: path.resolve(ref) }
}

export async function generateSceneImage(
  prompt: string,
  campaignId: string,
  refs?: WhiskRefs
): Promise<string> {
  const cookie = process.env.COOKIE
  if (!cookie) throw new Error('COOKIE not set in .env')

  const outputDir = path.resolve(`outputs/campaigns/${campaignId}`)
  await fs.ensureDir(outputDir)

  const whisk = new Whisk(cookie)

  console.log(`[whisk] Creating project vivr-${campaignId}...`)
  const project = await whisk.newProject(`vivr-${campaignId}`)

  if (refs?.subject) {
    console.log(`[whisk] Uploading subject ref...`)
    await project.addSubject(toImageInput(refs.subject))
  }
  if (refs?.scene) {
    console.log(`[whisk] Uploading scene ref...`)
    await project.addScene(toImageInput(refs.scene))
  }
  if (refs?.style) {
    console.log(`[whisk] Uploading style ref...`)
    await project.addStyle(toImageInput(refs.style))
  }

  const hasRefs = refs?.subject || refs?.scene || refs?.style
  console.log(`[whisk] Generating image${hasRefs ? ' with references' : ''}...`)

  const media = hasRefs
    ? await project.generateImageWithReferences({ prompt, aspectRatio: 'IMAGE_ASPECT_RATIO_PORTRAIT' })
    : await project.generateImage({ prompt, aspectRatio: 'IMAGE_ASPECT_RATIO_PORTRAIT' })

  const savedPath = media.save(outputDir)

  const ext = path.extname(savedPath)
  const finalPath = path.join(outputDir, `scene${ext}`)
  if (savedPath !== finalPath) {
    await fs.move(savedPath, finalPath, { overwrite: true })
  }

  console.log(`[whisk] Image saved at ${finalPath}`)
  return finalPath
}