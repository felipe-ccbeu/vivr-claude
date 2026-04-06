/**
 * generate-avatar-image.ts
 *
 * Gera uma imagem de personagem no Whisk para uso como avatar no HeyGen.
 * Salva em outputs/avatar-images/{character}-{timestamp}.png
 *
 * Usage:
 *   npx ts-node src/generate-avatar-image.ts --character protagonist
 *   npx ts-node src/generate-avatar-image.ts --character woman
 *   npx ts-node src/generate-avatar-image.ts --character bald
 *   npx ts-node src/generate-avatar-image.ts --character blonde
 *   npx ts-node src/generate-avatar-image.ts --character woman --prompt "custom prompt"
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
const getArg = (flag: string) => {
  const i = args.indexOf(flag)
  return i !== -1 ? args[i + 1] : undefined
}

const character   = getArg('--character') ?? 'protagonist'
const customPrompt = getArg('--prompt')

// ---------------------------------------------------------------------------
// Prompts canônicos por personagem
// Fundo branco, corpo inteiro visível, sem texto — ideal para avatar
// ---------------------------------------------------------------------------

const CHARACTER_PROMPTS: Record<string, string> = {
  protagonist: [
    '3D stylized adult cartoon character, elongated proportions,',
    'expressive exaggerated features, slightly prominent nose, large but non-infantile eyes,',
    'lean body, thin limbs, skin texture with subtle bump not smooth or shiny,',
    'high-fidelity 3D render, cinematic warm lighting, soft shadows, subtle rim light.',
    'Adult man, full dark beard, short brown hair, purple t-shirt, gray denim shorts, white sneakers.',
    'Open curious expression. Character centered, full body visible, plain white background.',
    'Style: adult animated series, elongated proportions.',
    'NOT Pixar, NOT Disney rounded, NOT smooth faces, NOT childish proportions.',
    'No text, no speech bubbles, no objects in hands.',
  ].join(' '),

  woman: [
    '3D stylized adult cartoon character, elongated proportions,',
    'expressive exaggerated features, slightly prominent nose, large but non-infantile eyes,',
    'lean body, thin limbs, skin texture with subtle bump not smooth or shiny,',
    'high-fidelity 3D render, cinematic warm lighting, soft shadows, subtle rim light.',
    'Professional adult woman, short auburn red bob hair cut above shoulders,',
    'black blazer, white dress shirt, red bow tie, dark slim trousers, red pointed-toe shoes.',
    'Hand on hip, confident upright posture. Character centered, full body visible, plain white background.',
    'Style: adult animated series, elongated proportions.',
    'NOT Pixar, NOT Disney rounded, NOT smooth faces, NOT childish proportions.',
    'No text, no speech bubbles, no objects in hands.',
  ].join(' '),

  bald: [
    '3D stylized adult cartoon character, elongated proportions,',
    'expressive exaggerated features, slightly prominent nose, large but non-infantile eyes,',
    'lean body, thin limbs, skin texture with subtle bump not smooth or shiny,',
    'high-fidelity 3D render, cinematic warm lighting, soft shadows, subtle rim light.',
    'Bald adult man, red long-sleeve shirt with the number 25 printed on chest,',
    'gray pants, blue sneakers. Neutral friendly expression.',
    'Character centered, full body visible, plain white background.',
    'Style: adult animated series, elongated proportions.',
    'NOT Pixar, NOT Disney rounded, NOT smooth faces, NOT childish proportions.',
    'No text, no speech bubbles, no objects in hands.',
  ].join(' '),

  blonde: [
    '3D stylized adult cartoon character, elongated proportions,',
    'expressive exaggerated features, slightly prominent nose, large but non-infantile eyes,',
    'lean body, thin limbs, skin texture with subtle bump not smooth or shiny,',
    'high-fidelity 3D render, cinematic warm lighting, soft shadows, subtle rim light.',
    'Young adult man, platinum blonde hair, green plaid button-up shirt,',
    'gray pants, green sneakers. Relaxed friendly posture.',
    'Character centered, full body visible, plain white background.',
    'Style: adult animated series, elongated proportions.',
    'NOT Pixar, NOT Disney rounded, NOT smooth faces, NOT childish proportions.',
    'No text, no speech bubbles, no objects in hands.',
  ].join(' '),

  'woman-meeting': [
    '3D stylized adult cartoon character, elongated proportions,',
    'expressive exaggerated features, slightly prominent nose, large but non-infantile eyes,',
    'lean body, thin limbs, skin texture with subtle bump not smooth or shiny,',
    'high-fidelity 3D render, cinematic warm lighting, soft shadows, subtle purple rim light.',
    'Professional adult woman, short auburn red bob hair, black blazer, white dress shirt, red bow tie.',
    'Sitting at a modern desk in front of a laptop, speaking confidently during a video call,',
    'one hand gesturing naturally mid-sentence, eyes engaged and bright.',
    'Modern home office background, soft natural window light, monitor glow,',
    'bookshelves slightly blurred in background.',
    'Depth of field, background slightly blurred. Medium shot, eye level.',
    'Expression: confident and articulate, fully in command of the conversation.',
    'Style: adult animated series, elongated proportions.',
    'NOT Pixar, NOT Disney rounded. No text, no speech bubbles.',
  ].join(' '),

  'protagonist-airport': [
    '3D stylized adult cartoon character, elongated proportions,',
    'expressive exaggerated features, slightly prominent nose, large but non-infantile eyes,',
    'lean body, thin limbs, skin texture with subtle bump not smooth or shiny,',
    'high-fidelity 3D render, cinematic warm lighting, soft shadows, subtle blue rim light.',
    'Adult man, full dark beard, short brown hair, purple t-shirt, gray denim shorts, white sneakers.',
    'Standing in airport departure hall, looking at gate signage, travel bag over shoulder,',
    'expression of focused calm — he knows exactly what to say.',
    'Airport background: gate signs, travelers blurred in distance, cool blue-white overhead lighting.',
    'Depth of field, background slightly blurred. Medium shot.',
    'Style: adult animated series, elongated proportions.',
    'NOT Pixar, NOT Disney rounded. No text, no speech bubbles.',
  ].join(' '),
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const ASPECT_RATIOS: Array<{ key: WhiskAspectRatio; label: string }> = [
  { key: 'PORTRAIT',  label: 'portrait'  },
  { key: 'SQUARE',    label: 'square'    },
  { key: 'LANDSCAPE', label: 'landscape' },
]

async function main() {
  const prompt = customPrompt ?? CHARACTER_PROMPTS[character]
  if (!prompt) {
    console.error(`Personagem desconhecido: "${character}"`)
    console.error(`Disponíveis: ${Object.keys(CHARACTER_PROMPTS).join(', ')}`)
    process.exit(1)
  }

  const outputDir = path.resolve('outputs/avatar-images')
  await fs.ensureDir(outputDir)
  const ts = Date.now()

  console.log('╔══════════════════════════════════════╗')
  console.log('║   Vivr Avatar Image Generator        ║')
  console.log('╚══════════════════════════════════════╝')
  console.log(`  Personagem: ${character}`)
  console.log(`  Proporções: portrait + square + landscape`)
  console.log(`  Output:     outputs/avatar-images/`)

  const generated: string[] = []

  for (const { key, label } of ASPECT_RATIOS) {
    console.log(`\n[${label}] Gerando...`)
    const campaignId = `avatar-${character}-${label}-${ts}`

    const imagePath = await generateSceneImage(
      prompt,
      campaignId,
      DEFAULT_REFS,
      key,
      character
    )

    const finalPath = path.join(outputDir, `${character}-${label}-${ts}.png`)
    await fs.copy(imagePath, finalPath)
    generated.push(finalPath)
    console.log(`[${label}] ✓ ${finalPath}`)
  }

  console.log('\n╔══════════════════════════════════════╗')
  console.log('║   ✓ 3 imagens geradas!               ║')
  console.log('╚══════════════════════════════════════╝')
  generated.forEach(f => console.log(`  ${f}`))
  console.log(`\n  Próximo passo:`)
  console.log(`  1. Acesse app.heygen.com`)
  console.log(`  2. Crie o avatar com a imagem que preferir`)
  console.log(`  3. Me mande o avatar_id para gerar vídeos`)
}

main().catch(err => {
  console.error('\n❌ Erro:', err.message)
  process.exit(1)
})
