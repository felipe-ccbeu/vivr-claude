/**
 * generate-avatar-image.ts
 *
 * Gera imagens de personagens do Vivr no Whisk para uso como avatar no HeyGen.
 * Salva em outputs/avatar-images/{portrait|square|landscape}/{character}-{timestamp}.png
 *
 * Usage:
 *   npx ts-node src/generate-avatar-image.ts --character protagonist
 *   npx ts-node src/generate-avatar-image.ts --character woman-black-cafe
 *   npx ts-node src/generate-avatar-image.ts --all
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

const character    = getArg('--character') ?? 'protagonist'
const customPrompt = getArg('--prompt')
const generateAll  = hasFlag('--all')

// ---------------------------------------------------------------------------
// Base de estilo — aplicada em todos os personagens
// ---------------------------------------------------------------------------

const BASE = [
  '3D stylized adult cartoon character, elongated proportions,',
  'expressive exaggerated features, slightly prominent nose, large but non-infantile eyes,',
  'lean body, thin limbs, skin texture with subtle bump not smooth or shiny,',
  'high-fidelity 3D render, cinematic warm lighting, soft shadows, subtle rim light.',
  'Style: adult animated series, elongated proportions.',
  'NOT Pixar, NOT Disney rounded, NOT smooth faces, NOT childish proportions.',
  'No text, no speech bubbles, no written words anywhere.',
].join(' ')

// ---------------------------------------------------------------------------
// Personagens × Cenários
// ---------------------------------------------------------------------------

const CHARACTER_PROMPTS: Record<string, string> = {

  // ── PROTAGONISTA (homem, barba escura, camiseta roxa) ────────────────────

  'protagonist': `${BASE}
    Adult man, full dark beard, short brown hair, purple t-shirt, gray denim shorts, white sneakers.
    Open curious expression. Character centered, full body visible, plain white background.`,

  'protagonist-cafe': `${BASE}
    Adult man, full dark beard, short brown hair, purple t-shirt, gray denim shorts, white sneakers.
    Sitting at a round wooden table in a cozy brick-wall café, warm pendant lights overhead,
    large window with city view, evening atmosphere. Leaning forward engaged, relaxed confident expression.
    Depth of field, background slightly blurred. Medium shot, eye level.`,

  'protagonist-airport': `${BASE}
    Adult man, full dark beard, short brown hair, purple t-shirt, gray denim shorts, white sneakers.
    Standing in airport departure hall, travel bag over shoulder, looking at gate signage,
    expression of focused calm. Cool blue-white overhead lighting, travelers blurred in background.
    Depth of field. Medium shot.`,

  'protagonist-meeting': `${BASE}
    Adult man, full dark beard, short brown hair, purple t-shirt.
    Sitting at a desk in front of a laptop during a video call, one hand gesturing mid-sentence,
    eyes confident and engaged. Modern home office, soft natural window light, monitor glow,
    bookshelves blurred in background. Medium shot, eye level.`,

  // ── MULHER PROFISSIONAL (bob ruivo, blazer preto) ────────────────────────

  'woman': `${BASE}
    Professional adult woman, short auburn red bob hair cut above shoulders,
    black blazer, white dress shirt, red bow tie, dark slim trousers, red pointed-toe shoes.
    Hand on hip, confident upright posture. Character centered, full body visible, plain white background.`,

  'woman-cafe': `${BASE}
    Professional adult woman, short auburn red bob hair, black blazer, white dress shirt, red bow tie.
    Sitting at a round wooden table in a brick-wall café, warm pendant lights, city view through large window.
    Talking naturally, hands expressive, warm confident smile.
    Depth of field, background slightly blurred. Medium shot.`,

  'woman-meeting': `${BASE}
    Professional adult woman, short auburn red bob hair, black blazer, white dress shirt, red bow tie.
    Sitting at a modern desk in front of a laptop, speaking confidently during a video call,
    one hand gesturing naturally mid-sentence, eyes engaged and bright.
    Modern home office, soft natural window light, monitor glow, bookshelves blurred in background.
    Depth of field. Medium shot, eye level. Expression: confident and articulate.`,

  'woman-airport': `${BASE}
    Professional adult woman, short auburn red bob hair, black blazer, white dress shirt, red bow tie, red shoes.
    Standing in airport departure hall, carry-on luggage beside her, looking at departure board,
    expression of calm confidence. Cool blue-white overhead lighting, travelers blurred in background.
    Depth of field. Medium shot.`,

  // ── HOMEM CARECA (camiseta vermelha nº25) ────────────────────────────────

  'bald': `${BASE}
    Bald adult man, red long-sleeve shirt with the number 25 printed on chest,
    gray pants, blue sneakers. Neutral friendly expression.
    Character centered, full body visible, plain white background.`,

  'bald-cafe': `${BASE}
    Bald adult man, red long-sleeve shirt with number 25, gray pants, blue sneakers.
    Sitting at a café table, brick wall background, warm pendant lights overhead.
    Relaxed open posture, friendly expression, coffee mug on table.
    Depth of field, background slightly blurred. Medium shot.`,

  'bald-airport': `${BASE}
    Bald adult man, red long-sleeve shirt with number 25, gray pants, blue sneakers.
    Walking through airport departure hall, small backpack, looking up at gate signs,
    expression of focused determination. Cool blue-white lighting, travelers in background.
    Depth of field. Medium shot.`,

  // ── JOVEM LOIRO (camisa xadrez verde) ────────────────────────────────────

  'blonde': `${BASE}
    Young adult man, platinum blonde hair, green plaid button-up shirt,
    gray pants, green sneakers. Relaxed friendly posture.
    Character centered, full body visible, plain white background.`,

  'blonde-cafe': `${BASE}
    Young adult man, platinum blonde hair, green plaid button-up shirt, gray pants, green sneakers.
    Sitting at a café table with a laptop open, brick wall background, warm pendant lights.
    Relaxed creative posture, slight smile, headphones around neck.
    Depth of field, background slightly blurred. Medium shot.`,

  'blonde-living-room': `${BASE}
    Young adult man, platinum blonde hair, green plaid button-up shirt, gray pants, green sneakers.
    Sitting on a modern sofa in a living room, wooden coffee table, natural window light, warm tones.
    Holding a phone, looking up with a surprised-but-pleased expression.
    Depth of field, background slightly blurred. Medium shot.`,

  // ── MULHER NEGRA (afro, blusa branca) ────────────────────────────────────

  'woman-black': `${BASE}
    Adult Black woman, natural coily afro hair, warm dark brown skin,
    fitted white blouse, high-waist beige trousers, white sneakers.
    Confident relaxed posture, warm open expression.
    Character centered, full body visible, plain white background.`,

  'woman-black-cafe': `${BASE}
    Adult Black woman, natural coily afro hair, warm dark brown skin,
    fitted white blouse, high-waist beige trousers, white sneakers.
    Sitting at a round wooden table in a brick-wall café, warm pendant lights overhead,
    large window with city view, evening atmosphere. Animated conversation gesture, bright smile.
    Depth of field, background slightly blurred. Medium shot.`,

  'woman-black-meeting': `${BASE}
    Adult Black woman, natural coily afro hair, warm dark brown skin,
    black blazer, white dress shirt, gold stud earrings.
    Sitting at a modern desk in front of a laptop, speaking confidently during a video call,
    one hand gesturing naturally mid-sentence, eyes engaged and bright.
    Modern home office, soft natural window light, monitor glow, bookshelves blurred in background.
    Depth of field. Medium shot, eye level. Expression: confident and articulate.`,

  'woman-black-living-room': `${BASE}
    Adult Black woman, natural coily afro hair, warm dark brown skin,
    casual chic — fitted white blouse, high-waist beige trousers, white sneakers.
    Sitting on a modern sofa in a living room, wooden coffee table, natural window light.
    Holding a phone, smiling at the screen with a proud relieved expression.
    Depth of field, background slightly blurred. Medium shot.`,
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
// Gerar um personagem (3 proporções)
// ---------------------------------------------------------------------------

async function generateCharacter(char: string, prompt: string): Promise<void> {
  const outputDir = path.resolve('outputs/avatar-images')
  const ts = Date.now()

  console.log(`\n${'═'.repeat(50)}`)
  console.log(`  Personagem: ${char}`)
  console.log('═'.repeat(50))

  for (const { key, label } of ASPECT_RATIOS) {
    console.log(`  [${label}] Gerando...`)
    const campaignId = `avatar-${char}-${label}-${ts}`

    const imagePath = await generateSceneImage(prompt, campaignId, DEFAULT_REFS, key, char)

    const subDir = path.join(outputDir, label)
    await fs.ensureDir(subDir)
    const finalPath = path.join(subDir, `${char}-${ts}.png`)
    await fs.copy(imagePath, finalPath)
    console.log(`  [${label}] ✓ avatar-images/${label}/${char}-${ts}.png`)
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('╔══════════════════════════════════════════════════╗')
  console.log('║        Vivr Avatar Image Generator               ║')
  console.log('╚══════════════════════════════════════════════════╝')

  if (generateAll) {
    const all = Object.keys(CHARACTER_PROMPTS)
    console.log(`  Modo: TODOS os personagens (${all.length} × 3 proporções = ${all.length * 3} imagens)`)
    for (const char of all) {
      await generateCharacter(char, CHARACTER_PROMPTS[char])
    }
  } else {
    const prompt = customPrompt ?? CHARACTER_PROMPTS[character]
    if (!prompt) {
      console.error(`\nPersonagem desconhecido: "${character}"`)
      console.error(`Disponíveis:\n  ${Object.keys(CHARACTER_PROMPTS).join('\n  ')}`)
      process.exit(1)
    }
    await generateCharacter(character, prompt)
  }

  console.log('\n╔══════════════════════════════════════════════════╗')
  console.log('║   ✓ Geração concluída!                           ║')
  console.log('╚══════════════════════════════════════════════════╝')
  console.log('  Arquivos em: outputs/avatar-images/portrait|square|landscape/')
  console.log('\n  Próximo passo:')
  console.log('  1. Acesse app.heygen.com e crie o avatar com a imagem que preferir')
  console.log('  2. Me mande o avatar_id para gerar vídeos com /vivavr-heygen-video')
}

main().catch(err => {
  console.error('\n❌ Erro:', err.message)
  process.exit(1)
})
