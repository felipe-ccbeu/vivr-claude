/**
 * generate-avatar-image.ts
 *
 * Gera imagens de personagens do Vivr no Whisk para uso como avatar no HeyGen.
 * Salva em outputs/avatar-images/{portrait|square|landscape}/{character}-{scene}-{timestamp}.png
 *
 * Usage:
 *   npx ts-node src/generate-avatar-image.ts --character protagonist --scene cafe
 *   npx ts-node src/generate-avatar-image.ts --all
 *   npx ts-node src/generate-avatar-image.ts --all --character protagonist
 */

import * as dotenv from 'dotenv'
import * as fs from 'fs-extra'
import * as path from 'path'
import { generateSceneImage, WhiskAspectRatio } from './whisk-client'
import { DEFAULT_REFS } from './config'

dotenv.config()

// ---------------------------------------------------------------------------
// Args
// ---------------------------------------------------------------------------

const args = process.argv.slice(2)
const getArg = (flag: string) => { const i = args.indexOf(flag); return i !== -1 ? args[i + 1] : undefined }
const hasFlag = (flag: string) => args.includes(flag)

const charArg      = getArg('--character')
const sceneArg     = getArg('--scene')
const generateAll  = hasFlag('--all')

// ---------------------------------------------------------------------------
// Base de estilo — aplicada em todos
// ---------------------------------------------------------------------------

const BASE = `3D stylized adult cartoon character, elongated proportions,
expressive exaggerated features, slightly prominent nose, large but non-infantile eyes,
lean body, thin limbs, skin texture with subtle bump not smooth or shiny,
high-fidelity 3D render, cinematic warm lighting, soft shadows, subtle rim light.
Style: adult animated series, elongated proportions.
NOT Pixar, NOT Disney rounded, NOT smooth faces, NOT childish proportions.
No text, no speech bubbles, no written words anywhere in the image.`

// ---------------------------------------------------------------------------
// Personagens canônicos
// ---------------------------------------------------------------------------

const CHARACTERS: Record<string, string> = {
  protagonist: `Adult man, full dark beard, short brown hair, purple t-shirt, gray denim shorts, white sneakers. Open curious expression.`,
  woman:       `Professional adult woman, short auburn red bob hair cut above shoulders, black blazer, white dress shirt, red bow tie, dark slim trousers, red pointed-toe shoes. Confident posture.`,
  bald:        `Bald adult man, red long-sleeve shirt with the number 25 printed on chest, gray pants, blue sneakers. Friendly expression.`,
  blonde:      `Young adult man, platinum blonde hair, green plaid button-up shirt, gray pants, green sneakers. Relaxed friendly posture.`,
  'woman-black': `Adult Black woman, natural coily afro hair, warm dark brown skin, fitted white blouse, high-waist beige trousers, white sneakers. Confident warm expression.`,

  'woman-suit': `Professional adult woman, straight red hair in a sleek cut, sharp fitted dark navy suit jacket with matching trousers, white shirt underneath, oxford heels. Poised authoritative posture, sharp confident expression.`,

  'elder-crochet': `Older adult man, late 50s, round wire-frame glasses, warm grandfatherly expression, wearing a handmade crochet sweater in earthy tones — cream, brown, and mustard patterns — relaxed-fit chinos, comfortable loafers. Gentle wise expression, slightly silver temples.`,

  'young-black-man': `Young adult Black man, short natural hair, clean-shaven smooth dark brown skin, bright eyes, casual smart outfit — fitted light blue shirt, dark slim chinos, white sneakers. Open friendly expression, relaxed confident posture.`,
}

// ---------------------------------------------------------------------------
// Cenários
// ---------------------------------------------------------------------------

const SCENES: Record<string, string> = {
  airport: `Standing in a busy airport departure hall, travel bag over shoulder, looking up at gate signage with a calm focused expression. Cool blue-white overhead fluorescent lighting, gate numbers and flight boards visible, blurred travelers in background. Depth of field, wide shot showing full environment.`,

  cafe: `Sitting at a round wooden table in a cozy brick-wall café, warm amber pendant lights hanging overhead, large window with city view outside, evening atmosphere. Relaxed engaged posture, coffee cup on table, other patrons softly blurred in background. Cinematic warm lighting, depth of field. Medium shot.`,

  meeting: `Sitting at a modern office desk in front of an open laptop during a video call, one hand gesturing confidently mid-sentence, eyes bright and engaged. Modern home office: soft natural light from side window, monitor glow, bookshelves blurred in background. Medium shot, eye level.`,

  street: `Standing on a city street asking for directions, turning to speak with a passing local, one hand pointing ahead, expression open and confident. Urban backdrop: café awnings, parked bikes, city buildings, natural daylight. Slight depth of field, street scene blurred behind. Medium shot.`,

  interview: `Sitting across a desk from a hiring manager in a modern bright office, upright professional posture, hands on table, confident eye contact, slight smile. Clean office environment: plants, whiteboards, large windows with city view. Formal but approachable expression. Medium shot, eye level.`,

  tourist: `Standing in front of a famous landmark — historic European city square, cobblestone plaza, grand architecture in background. Holding a small map or phone, looking around with curiosity and excitement. Warm golden afternoon light, tourists softly blurred in background. Wide shot.`,

  restaurant: `Sitting at an elegant restaurant table with a menu open, speaking to a waiter who is taking notes, gesturing naturally at the menu with a confident relaxed expression. Restaurant ambiance: white tablecloths, wine glasses, warm candlelight, other diners blurred in background. Medium shot.`,

  bar: `Standing at a lively bar counter ordering a drink, leaning on the bar relaxed, speaking naturally to the bartender, casual confident expression. Bar atmosphere: shelves of bottles backlit in amber, low warm lighting, blurred patrons in background, wooden bar counter. Medium shot, slightly low angle.`,
}

// ---------------------------------------------------------------------------
// Aspect ratios
// ---------------------------------------------------------------------------

const ASPECT_RATIOS: Array<{ key: WhiskAspectRatio; label: string }> = [
  { key: 'PORTRAIT',  label: 'portrait'  },
  { key: 'SQUARE',    label: 'square'    },
  { key: 'LANDSCAPE', label: 'landscape' },
]

// ---------------------------------------------------------------------------
// Gerar uma combinação personagem × cena (3 proporções)
// ---------------------------------------------------------------------------

async function generateOne(char: string, scene: string): Promise<void> {
  const charDesc  = CHARACTERS[char]
  const sceneDesc = SCENES[scene]
  const prompt    = `${BASE} ${charDesc} ${sceneDesc}`
  const outputDir = path.resolve('outputs/avatar-images')
  const ts        = Date.now()
  const slug      = `${char}-${scene}`

  console.log(`\n${'─'.repeat(52)}`)
  console.log(`  ${slug}`)
  console.log('─'.repeat(52))

  for (const { key, label } of ASPECT_RATIOS) {
    process.stdout.write(`  [${label}] Gerando... `)
    const campaignId = `avatar-${slug}-${label}-${ts}`
    const imagePath  = await generateSceneImage(prompt, campaignId, DEFAULT_REFS, key, slug)
    const subDir     = path.join(outputDir, label)
    await fs.ensureDir(subDir)
    const finalPath  = path.join(subDir, `${slug}-${ts}.png`)
    await fs.copy(imagePath, finalPath)
    console.log(`✓`)
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const allChars  = Object.keys(CHARACTERS)
  const allScenes = Object.keys(SCENES)

  console.log('╔════════════════════════════════════════════════════╗')
  console.log('║         Vivr Avatar Image Generator                ║')
  console.log('╚════════════════════════════════════════════════════╝')

  if (generateAll) {
    const chars  = charArg ? [charArg] : allChars
    const scenes = sceneArg ? [sceneArg] : allScenes
    const total  = chars.length * scenes.length * 3

    console.log(`  Personagens: ${chars.join(', ')}`)
    console.log(`  Cenários:    ${scenes.join(', ')}`)
    console.log(`  Total:       ${chars.length} × ${scenes.length} × 3 proporções = ${total} imagens`)

    for (const char of chars) {
      for (const scene of scenes) {
        await generateOne(char, scene)
      }
    }
  } else {
    const char  = charArg ?? 'protagonist'
    const scene = sceneArg ?? 'cafe'

    if (!CHARACTERS[char]) {
      console.error(`\nPersonagem desconhecido: "${char}"`)
      console.error(`Disponíveis: ${allChars.join(', ')}`)
      process.exit(1)
    }
    if (!SCENES[scene]) {
      console.error(`\nCenário desconhecido: "${scene}"`)
      console.error(`Disponíveis: ${allScenes.join(', ')}`)
      process.exit(1)
    }

    await generateOne(char, scene)
  }

  console.log('\n╔════════════════════════════════════════════════════╗')
  console.log('║   ✓ Geração concluída!                             ║')
  console.log('╚════════════════════════════════════════════════════╝')
  console.log('  Arquivos em: outputs/avatar-images/portrait|square|landscape/')
  console.log('\n  Próximo passo:')
  console.log('  1. Acesse app.heygen.com e crie o avatar com a imagem que preferir')
  console.log('  2. Me mande o avatar_id para gerar vídeos com /vivavr-heygen-video')
}

main().catch(err => {
  console.error('\n❌ Erro:', err.message)
  process.exit(1)
})