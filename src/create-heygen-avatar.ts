/**
 * create-heygen-avatar.ts
 *
 * Pipeline semi-automatizado:
 * 1. Gera imagem no Whisk
 * 2. Faz upload para HeyGen Assets
 * 3. Abre o browser na página de criação de avatar com o asset pronto
 * 4. Aguarda você criar o avatar manualmente (só um clique)
 * 5. Detecta o novo avatar automaticamente e salva o ID
 *
 * Usage:
 *   npx ts-node src/create-heygen-avatar.ts --name "Protagonista"
 *   npx ts-node src/create-heygen-avatar.ts --name "Mulher Profissional" --character woman
 *   npx ts-node src/create-heygen-avatar.ts --name "Teste" --skip-whisk --asset-id <id>
 */

import * as dotenv from 'dotenv'
import * as fs from 'fs-extra'
import * as path from 'path'
import FormData = require('form-data')
import fetch from 'node-fetch'
import { exec } from 'child_process'
import { generateSceneImage } from './whisk-client'
import { DEFAULT_REFS } from './config'

dotenv.config()

const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY
if (!HEYGEN_API_KEY) throw new Error('HEYGEN_API_KEY não encontrada no .env')

// ---------------------------------------------------------------------------
// Args
// ---------------------------------------------------------------------------

const args = process.argv.slice(2)
const getArg = (flag: string) => {
  const i = args.indexOf(flag)
  return i !== -1 ? args[i + 1] : undefined
}
const hasFlag = (flag: string) => args.includes(flag)

const avatarName  = getArg('--name') ?? 'Vivr Avatar'
const character   = getArg('--character') ?? 'protagonist'
const skipWhisk   = hasFlag('--skip-whisk')
const skipUpload  = hasFlag('--skip-upload')
const existingAssetId = getArg('--asset-id')

const CHARACTER_PROMPTS: Record<string, string> = {
  protagonist: [
    '3D stylized adult cartoon character, elongated proportions, expressive face,',
    'slightly prominent nose, large but non-infantile eyes, lean body, thin limbs,',
    'skin texture with subtle bump not smooth or shiny, high-fidelity 3D render,',
    'cinematic warm lighting, soft shadows, subtle rim light,',
    'white background, character centered, full body visible,',
    'adult man, full dark beard, short brown hair, purple t-shirt,',
    'gray denim shorts, white sneakers, open curious expression',
  ].join(' '),

  woman: [
    '3D stylized adult cartoon character, elongated proportions, expressive face,',
    'slightly prominent nose, large but non-infantile eyes, lean body, thin limbs,',
    'skin texture with subtle bump not smooth or shiny, high-fidelity 3D render,',
    'cinematic warm lighting, soft shadows, subtle rim light,',
    'white background, character centered, full body visible,',
    'adult professional woman, short auburn red bob hair cut above shoulders,',
    'black blazer, white dress shirt, red bow tie, dark slim trousers,',
    'red pointed-toe shoes, hand on hip, confident upright posture',
  ].join(' '),

  bald: [
    '3D stylized adult cartoon character, elongated proportions, expressive face,',
    'slightly prominent nose, large but non-infantile eyes, lean body, thin limbs,',
    'skin texture with subtle bump not smooth or shiny, high-fidelity 3D render,',
    'cinematic warm lighting, soft shadows, subtle rim light,',
    'white background, character centered, full body visible,',
    'bald adult man, red long-sleeve shirt with number 25,',
    'gray pants, blue sneakers, neutral friendly expression',
  ].join(' '),

  blonde: [
    '3D stylized adult cartoon character, elongated proportions, expressive face,',
    'slightly prominent nose, large but non-infantile eyes, lean body, thin limbs,',
    'skin texture with subtle bump not smooth or shiny, high-fidelity 3D render,',
    'cinematic warm lighting, soft shadows, subtle rim light,',
    'white background, character centered, full body visible,',
    'young adult man, platinum blonde hair, green plaid button-up shirt,',
    'gray pants, green sneakers, relaxed posture',
  ].join(' '),
}

const prompt = CHARACTER_PROMPTS[character] ?? CHARACTER_PROMPTS.protagonist

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function openBrowser(url: string) {
  const cmd = process.platform === 'win32'
    ? `start "" "${url}"`
    : process.platform === 'darwin'
    ? `open "${url}"`
    : `xdg-open "${url}"`
  exec(cmd)
}

function log(step: string, msg: string) {
  console.log(`\n[${step}] ${msg}`)
}

// ---------------------------------------------------------------------------
// Step 1: Gerar imagem no Whisk
// ---------------------------------------------------------------------------

async function generateAvatarImage(): Promise<string> {
  const campaignId = `heygen-avatar-${Date.now()}`
  log('1/4', `Gerando imagem no Whisk (personagem: ${character})...`)

  const imagePath = await generateSceneImage(
    prompt,
    campaignId,
    DEFAULT_REFS,
    'PORTRAIT',
    'avatar'
  )

  log('1/4', `Imagem gerada: ${imagePath}`)
  return imagePath
}

// ---------------------------------------------------------------------------
// Step 2: Upload para HeyGen Assets
// ---------------------------------------------------------------------------

async function uploadImageToHeyGen(imagePath: string): Promise<{ assetId: string, assetUrl: string }> {
  log('2/4', 'Fazendo upload para HeyGen Assets...')

  const fileBuffer = await fs.readFile(imagePath)
  const ext = path.extname(imagePath).replace('.', '').toLowerCase()
  const mimeType = ext === 'png' ? 'image/png' : ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'image/webp'

  const res = await fetch('https://upload.heygen.com/v1/asset', {
    method: 'POST',
    headers: {
      'X-Api-Key': HEYGEN_API_KEY!,
      'Content-Type': mimeType,
    },
    body: fileBuffer,
  })

  const json = await res.json() as any
  if (json.code && json.code !== 100) throw new Error(`Upload falhou: ${JSON.stringify(json)}`)

  const assetId  = json.data?.id
  const assetUrl = json.data?.url
  if (!assetId) throw new Error(`Asset ID não encontrado: ${JSON.stringify(json)}`)

  log('2/4', `Upload concluído!`)
  log('2/4', `Asset ID:  ${assetId}`)
  log('2/4', `Asset URL: ${assetUrl}`)
  return { assetId, assetUrl }
}

// ---------------------------------------------------------------------------
// Step 3: Listar avatars atuais (para detectar o novo depois)
// ---------------------------------------------------------------------------

async function listCurrentTalkingPhotos(): Promise<string[]> {
  const res = await fetch('https://api.heygen.com/v1/talking_photo.list', {
    headers: { 'X-Api-Key': HEYGEN_API_KEY! },
  })
  const json = await res.json() as any
  const photos: any[] = json.data ?? []
  return photos.map((p: any) => p.id)
}

// ---------------------------------------------------------------------------
// Step 4: Aguardar criação manual e detectar novo avatar
// ---------------------------------------------------------------------------

async function waitForNewAvatar(existingIds: string[], avatarName: string): Promise<string> {
  log('4/4', 'Aguardando você criar o avatar no HeyGen...')
  log('4/4', 'Verificando a cada 10 segundos...')

  let attempts = 0
  const maxAttempts = 36 // 6 minutos no máximo

  while (attempts < maxAttempts) {
    await sleep(10000)
    attempts++

    const res = await fetch('https://api.heygen.com/v1/talking_photo.list', {
      headers: { 'X-Api-Key': HEYGEN_API_KEY! },
    })
    const json = await res.json() as any
    const photos: any[] = json.data ?? []

    const newPhoto = photos.find((p: any) => !existingIds.includes(p.id))
    if (newPhoto) {
      log('4/4', `Novo avatar detectado!`)
      log('4/4', `ID: ${newPhoto.id}`)
      return newPhoto.id
    }

    process.stdout.write(`  aguardando... (${attempts * 10}s)\r`)
  }

  throw new Error('Timeout: avatar não detectado em 6 minutos.')
}

// ---------------------------------------------------------------------------
// Salvar resultado
// ---------------------------------------------------------------------------

async function saveResult(result: Record<string, any>): Promise<void> {
  const outputDir = path.resolve('outputs/heygen')
  await fs.ensureDir(outputDir)
  const outputFile = path.join(outputDir, `${result.talkingPhotoId ?? result.assetId}.json`)
  await fs.writeJson(outputFile, result, { spaces: 2 })
  log('✓', `Resultado salvo em: ${outputFile}`)
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('╔══════════════════════════════════════╗')
  console.log('║   Vivr HeyGen Avatar Creator         ║')
  console.log('╚══════════════════════════════════════╝')
  console.log(`  Nome:       ${avatarName}`)
  console.log(`  Personagem: ${character}`)
  console.log(`  Skip Whisk: ${skipWhisk}`)

  // Step 1: Whisk ou usar asset existente
  let imagePath: string | null = null
  let assetId: string = ''
  let assetUrl: string = ''

  if (existingAssetId) {
    log('1/4', `Usando asset existente: ${existingAssetId}`)
    assetId  = existingAssetId
    assetUrl = `https://resource2.heygen.ai/image/${existingAssetId}/original.png`
  } else if (skipWhisk) {
    throw new Error('--skip-whisk requer --asset-id <id>')
  } else {
    imagePath = await generateAvatarImage()
  }

  // Modo --skip-upload: apenas gera a imagem e encerra
  if (skipUpload && imagePath) {
    const outputDir = path.resolve('outputs/heygen')
    await fs.ensureDir(outputDir)
    const destPath = path.join(outputDir, `${avatarName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.png`)
    await fs.copy(imagePath, destPath)
    console.log('\n╔══════════════════════════════════════╗')
    console.log('║   ✓ Imagem gerada!                   ║')
    console.log('╚══════════════════════════════════════╝')
    console.log(`  Arquivo: ${destPath}`)
    console.log(`\n  Próximo passo:`)
    console.log(`  1. Acesse app.heygen.com e crie o avatar com esta imagem`)
    console.log(`  2. Copie o avatar_id`)
    console.log(`  3. Me mande o ID para gerar vídeos`)
    return
  }

  // Step 2: Upload
  if (!existingAssetId && imagePath) {
    const uploaded = await uploadImageToHeyGen(imagePath)
    assetId  = uploaded.assetId
    assetUrl = uploaded.assetUrl
  }

  // Step 3: Listar avatars atuais antes de abrir o browser
  const existingIds = await listCurrentTalkingPhotos()
  log('3/4', `${existingIds.length} talking photos existentes registrados.`)

  // Step 4: Abrir browser na página de criação
  const heygenUrl = 'https://app.heygen.com/photo-avatar'
  log('3/4', '─────────────────────────────────────────────────')
  log('3/4', 'Abrindo HeyGen no browser...')
  log('3/4', '')
  log('3/4', '  O que fazer:')
  log('3/4', '  1. Clique em "Create Photo Avatar"')
  log('3/4', '  2. Escolha "Upload Photo"')
  log('3/4', '  3. Use esta URL da imagem gerada:')
  log('3/4', `     ${assetUrl}`)
  log('3/4', '  4. Dê o nome: ' + avatarName)
  log('3/4', '  5. Clique em "Create" e aguarde')
  log('3/4', '─────────────────────────────────────────────────')

  openBrowser(heygenUrl)

  // Step 5: Aguardar e detectar
  const talkingPhotoId = await waitForNewAvatar(existingIds, avatarName)

  await saveResult({
    avatarName,
    character,
    talkingPhotoId,
    assetId,
    assetUrl,
    imagePath,
    createdAt: new Date().toISOString(),
  })

  console.log('\n╔══════════════════════════════════════╗')
  console.log('║   ✓ Avatar pronto!                   ║')
  console.log('╚══════════════════════════════════════╝')
  console.log(`  Talking Photo ID: ${talkingPhotoId}`)
  console.log(`  Use este ID no HeyGen MCP para gerar vídeos.`)
  console.log(`\n  Exemplo:`)
  console.log(`  /vivavr-heygen-video --avatar ${talkingPhotoId}`)
}

main().catch(err => {
  console.error('\n❌ Erro:', err.message)
  process.exit(1)
})
