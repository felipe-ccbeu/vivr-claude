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

export type WhiskAspectRatio = 'SQUARE' | 'PORTRAIT' | 'LANDSCAPE'

const ASPECT_RATIO_MAP: Record<WhiskAspectRatio, string> = {
  SQUARE: 'IMAGE_ASPECT_RATIO_SQUARE',
  PORTRAIT: 'IMAGE_ASPECT_RATIO_PORTRAIT',
  LANDSCAPE: 'IMAGE_ASPECT_RATIO_LANDSCAPE',
}

export async function generateSceneImage(
  prompt: string,
  campaignId: string,
  refs?: WhiskRefs,
  aspectRatio: WhiskAspectRatio = 'SQUARE',
  outputFileName: string = 'scene',
  outputDirOverride?: string
): Promise<string> {
  const cookie = process.env.COOKIE
  if (!cookie) throw new Error('COOKIE not set in .env')

  const outputDir = outputDirOverride
    ? path.resolve(outputDirOverride)
    : path.resolve(`outputs/campaigns/${campaignId}`)
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

  const whiskAspect = ASPECT_RATIO_MAP[aspectRatio] as import('@rohitaryal/whisk-api/dist/Types.js').ImageAspectRatioType
  const media = hasRefs
    ? await project.generateImageWithReferences({ prompt, aspectRatio: whiskAspect })
    : await project.generateImage({ prompt, aspectRatio: whiskAspect })

  const savedPath = media.save(outputDir)

  const ext = path.extname(savedPath)
  const finalPath = path.join(outputDir, `${outputFileName}${ext}`)
  if (savedPath !== finalPath) {
    await fs.move(savedPath, finalPath, { overwrite: true })
  }

  console.log(`[whisk] Image saved at ${finalPath}`)
  return finalPath
}