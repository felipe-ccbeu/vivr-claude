/**
 * create-heygen-avatar.ts
 *
 * Pipeline: Whisk → imagem local → upload HeyGen asset → criar Photo Avatar → treinar → retornar avatar_id
 *
 * Usage:
 *   npx ts-node src/create-heygen-avatar.ts --name "Nome do Avatar" --prompt "descrição visual"
 *   npx ts-node src/create-heygen-avatar.ts --name "Personagem Café" --prompt "..." --no-train
 */

import * as dotenv from 'dotenv'
import * as fs from 'fs-extra'
import * as path from 'path'
import FormData = require('form-data')
import fetch from 'node-fetch'
import { generateSceneImage } from './whisk-client'
import { DEFAULT_REFS } from './config'

dotenv.config()

const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY
if (!HEYGEN_API_KEY) throw new Error('HEYGEN_API_KEY não encontrada no .env')

const HEYGEN_BASE = 'https://api.heygen.com'

// ---------------------------------------------------------------------------
// Args
// ---------------------------------------------------------------------------

const args = process.argv.slice(2)
const getArg = (flag: string) => {
  const i = args.indexOf(flag)
  return i !== -1 ? args[i + 1] : undefined
}
const hasFlag = (flag: string) => args.includes(flag)

const avatarName = getArg('--name') ?? 'Vivr Avatar'
const prompt = getArg('--prompt') ?? buildDefaultPrompt()
const noTrain = hasFlag('--no-train')
const aspectRatio = (getArg('--aspect') ?? 'PORTRAIT') as 'PORTRAIT' | 'SQUARE' | 'LANDSCAPE'

function buildDefaultPrompt(): string {
  return [
    '3D stylized adult cartoon character, elongated proportions, expressive face,',
    'slightly prominent nose, large but non-infantile eyes, lean body, thin limbs,',
    'skin texture with subtle bump not smooth or shiny,',
    'high-fidelity 3D render, cinematic warm lighting, soft shadows, subtle rim light,',
    'white background, character centered, full body visible,',
    'adult professional appearance, neutral expression',
  ].join(' ')
}

// ---------------------------------------------------------------------------
// Step 1: Gerar imagem no Whisk
// ---------------------------------------------------------------------------

async function generateAvatarImage(): Promise<string> {
  const campaignId = `heygen-avatar-${Date.now()}`
  console.log(`\n[1/4] Gerando imagem no Whisk (campanha: ${campaignId})...`)

  const imagePath = await generateSceneImage(
    prompt,
    campaignId,
    DEFAULT_REFS,
    aspectRatio,
    'avatar'
  )

  console.log(`[1/4] Imagem gerada: ${imagePath}`)
  return imagePath
}

// ---------------------------------------------------------------------------
// Step 2: Upload da imagem para HeyGen Assets
// ---------------------------------------------------------------------------

async function uploadImageToHeyGen(imagePath: string): Promise<string> {
  console.log(`\n[2/4] Fazendo upload para HeyGen Assets...`)

  const fileBuffer = await fs.readFile(imagePath)
  const ext = path.extname(imagePath).replace('.', '').toLowerCase()
  const mimeType = ext === 'png' ? 'image/png' : ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'image/webp'

  const res = await fetch(`https://upload.heygen.com/v1/asset`, {
    method: 'POST',
    headers: {
      'X-Api-Key': HEYGEN_API_KEY!,
      'Content-Type': mimeType,
    },
    body: fileBuffer,
  })

  const json = await res.json() as any
  if (json.code && json.code !== 100) throw new Error(`Upload falhou: ${JSON.stringify(json)}`)

  const assetId = json.data?.id
  if (!assetId) throw new Error(`Asset ID não encontrado na resposta: ${JSON.stringify(json)}`)

  console.log(`[2/4] Asset uploaded — ID: ${assetId}`)
  return assetId
}

// ---------------------------------------------------------------------------
// Step 3: Criar Photo Avatar
// ---------------------------------------------------------------------------

async function createPhotoAvatar(assetId: string, name: string): Promise<string> {
  console.log(`\n[3/4] Criando Photo Avatar "${name}"...`)

  const res = await fetch(`${HEYGEN_BASE}/v1/photo_avatar/photo/upload`, {
    method: 'POST',
    headers: {
      'X-Api-Key': HEYGEN_API_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      image_asset_id: assetId,
      name,
    }),
  })

  const json = await res.json() as any
  if (json.error) throw new Error(`Criação de avatar falhou: ${JSON.stringify(json.error)}`)

  const photoAvatarId = json.data?.photo_avatar_id ?? json.data?.id
  if (!photoAvatarId) throw new Error(`photo_avatar_id não encontrado: ${JSON.stringify(json)}`)

  console.log(`[3/4] Photo Avatar criado — ID: ${photoAvatarId}`)
  return photoAvatarId
}

// ---------------------------------------------------------------------------
// Step 4: Treinar o avatar (gera looks e motion)
// ---------------------------------------------------------------------------

async function trainPhotoAvatar(photoAvatarId: string): Promise<void> {
  console.log(`\n[4/4] Iniciando treinamento do avatar...`)

  const res = await fetch(`${HEYGEN_BASE}/v1/photo_avatar/train`, {
    method: 'POST',
    headers: {
      'X-Api-Key': HEYGEN_API_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ photo_avatar_id: photoAvatarId }),
  })

  const json = await res.json() as any
  if (json.error) throw new Error(`Treinamento falhou: ${JSON.stringify(json.error)}`)

  console.log(`[4/4] Treinamento iniciado — leva alguns minutos para ficar disponível.`)
  console.log(`      Acompanhe em: https://app.heygen.com/photo-avatar`)
}

// ---------------------------------------------------------------------------
// Salvar resultado
// ---------------------------------------------------------------------------

async function saveResult(result: {
  avatarName: string
  photoAvatarId: string
  assetId: string
  imagePath: string
  trained: boolean
}): Promise<void> {
  const outputDir = path.resolve('outputs/heygen-avatars')
  await fs.ensureDir(outputDir)
  const outputFile = path.join(outputDir, `${result.photoAvatarId}.json`)
  await fs.writeJson(outputFile, result, { spaces: 2 })
  console.log(`\nResultado salvo em: ${outputFile}`)
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('=== Vivr HeyGen Avatar Creator ===')
  console.log(`Nome: ${avatarName}`)
  console.log(`Prompt: ${prompt}`)
  console.log(`Aspect: ${aspectRatio}`)
  console.log(`Treinar: ${!noTrain}`)

  const imagePath = await generateAvatarImage()
  const assetId = await uploadImageToHeyGen(imagePath)
  const photoAvatarId = await createPhotoAvatar(assetId, avatarName)

  if (!noTrain) {
    await trainPhotoAvatar(photoAvatarId)
  }

  await saveResult({
    avatarName,
    photoAvatarId,
    assetId,
    imagePath,
    trained: !noTrain,
  })

  console.log('\n✓ Pipeline concluído!')
  console.log(`  Photo Avatar ID: ${photoAvatarId}`)
  console.log(`  Use este ID no HeyGen para gerar vídeos.`)
}

main().catch(err => {
  console.error('\n❌ Erro:', err.message)
  process.exit(1)
})
