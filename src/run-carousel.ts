/**
 * run-carousel.ts — Whisk image generation + render + screenshot de carrossel V1 (5 slides).
 *
 * Uso:
 *   npx ts-node src/run-carousel.ts outputs/campaigns/carousel/NNN-slug/carousel.json
 *
 * Se carousel.json tiver campo `visual.whiskPrompt` e scene.png não existir, gera a imagem via Whisk.
 *
 * Gera em outputs/campaigns/carousel/NNN-slug/carousel/:
 *   slide-1.html + slide-1.png
 *   slide-2.html + slide-2.png
 *   slide-3.html + slide-3.png
 *   slide-4.html + slide-4.png
 *   slide-5.html + slide-5.png
 */
import * as fs from 'fs-extra'
import * as path from 'path'
import { CarouselContent } from './content-schema'
import {
  buildCarouselSlide1,
  buildCarouselSlide2,
  buildCarouselSlide3,
  buildCarouselSlide4,
  buildCarouselSlide5,
} from './templates/carousel-v1'
import { exportPNG } from './screenshot'
import { generateSceneImage } from './whisk-client'
import { DEFAULT_REFS } from './config'

const SLIDE_SIZE = { width: 540, height: 675 }

async function main() {
  const contentPath = process.argv[2]
  if (!contentPath) {
    console.error('Usage: npx ts-node src/run-carousel.ts <path/to/carousel.json>')
    process.exit(1)
  }

  const absPath = path.resolve(contentPath)
  if (!await fs.pathExists(absPath)) {
    console.error(`File not found: ${absPath}`)
    process.exit(1)
  }

  const content: CarouselContent = await fs.readJson(absPath)
  const campaignDir = path.dirname(absPath)
  const outDir = path.join(campaignDir, 'carousel')
  await fs.ensureDir(outDir)

  console.log(`[run-carousel] Campaign: ${content.campaignId} | Scene: ${content.scene}`)

  // Generate scene image via Whisk if needed
  const absImage = path.resolve(campaignDir, content.sceneImage)
  if (!await fs.pathExists(absImage) && (content as any).visual?.whiskPrompt) {
    const visual = (content as any).visual
    console.log(`[run-carousel] scene.png not found — generating via Whisk...`)
    const refs = { ...DEFAULT_REFS, ...visual.refs }
    await generateSceneImage(visual.whiskPrompt, content.campaignId, refs, 'SQUARE', 'scene', campaignDir)
    console.log(`[run-carousel] scene.png generated`)
  } else if (!await fs.pathExists(absImage)) {
    console.warn(`[run-carousel] WARNING: scene.png not found at ${absImage} and no visual.whiskPrompt in carousel.json`)
  }

  // Resolve image path relative to outDir
  const imageSrc = path.relative(outDir, absImage).replace(/\\/g, '/')

  const slides = [
    buildCarouselSlide1({ ...content.slide1, imageSrc }),
    buildCarouselSlide2({ ...content.slide2, imageSrc }),
    buildCarouselSlide3(content.slide3),
    buildCarouselSlide4({ ...content.slide4, imageSrc }),
    buildCarouselSlide5(content.slide5),
  ]

  for (let i = 0; i < slides.length; i++) {
    const n = i + 1
    const htmlPath = path.join(outDir, `slide-${n}.html`)
    const pngPath  = path.join(outDir, `slide-${n}.png`)

    await fs.writeFile(htmlPath, slides[i], 'utf8')
    console.log(`[run-carousel] HTML: carousel/slide-${n}.html`)

    await exportPNG(htmlPath, pngPath, SLIDE_SIZE)
    console.log(`[run-carousel] PNG:  carousel/slide-${n}.png`)
  }

  console.log(`[run-carousel] Done — 5 slides saved to ${path.relative(process.cwd(), outDir)}`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
