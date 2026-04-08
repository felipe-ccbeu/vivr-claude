/**
 * generate-video.ts
 *
 * Orquestra a geração de um vídeo HeyGen a partir de um brief:
 * 1. Lê o brief JSON da pasta briefs/
 * 2. Seleciona o personagem e cena (ou usa flags)
 * 3. Monta o prompt HeyGen com as regras da marca Vivr
 * 4. Chama a API HeyGen via create_video_agent
 * 5. Salva a entrada no video-registry.json
 *
 * Usage:
 *   npx ts-node scripts/generate-video.ts --brief airport-checkin --character black-woman
 *   npx ts-node scripts/generate-video.ts --brief restaurant-confidence --character old-man --scene restaurant
 *   npx ts-node scripts/generate-video.ts --brief airport-checkin --all-characters
 */

import * as dotenv from 'dotenv'
import * as fs from 'fs-extra'
import * as path from 'path'
import fetch from 'node-fetch'

dotenv.config()

const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY
if (!HEYGEN_API_KEY) throw new Error('HEYGEN_API_KEY não encontrada no .env')

const REGISTRY_PATH  = path.resolve('outputs/heygen/video-registry.json')
const AVATAR_REGISTRY = path.resolve('outputs/heygen/avatar-registry.json')
const BRIEFS_DIR     = path.resolve('briefs')

// ---------------------------------------------------------------------------
// Args
// ---------------------------------------------------------------------------

const args = process.argv.slice(2)
const getArg = (flag: string) => { const i = args.indexOf(flag); return i !== -1 ? args[i + 1] : undefined }
const hasFlag = (flag: string) => args.includes(flag)

const briefId      = getArg('--brief')
const characterArg = getArg('--character')
const sceneArg     = getArg('--scene')
const allChars     = hasFlag('--all-characters')
const orientation  = (getArg('--orientation') ?? 'portrait') as 'portrait' | 'landscape'
const durationSec  = parseInt(getArg('--duration') ?? '10', 10)

if (!briefId) {
  console.error('Uso: npx ts-node scripts/generate-video.ts --brief <id> [--character <id>] [--scene <id>] [--all-characters]')
  process.exit(1)
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CopyBlock {
  hook: string
  headline: string
  accentWord?: string
  body: string
  cta: string
}

interface BriefFile {
  id: string
  title: string
  audience: string
  pain: string
  angle: string
  targetCharacters: string[]
  copy: CopyBlock
  copyVariants?: CopyBlock[]
  visual: { scene: string; mood: string; zones: Record<string, string> }
  scriptConstraints: { maxWords: number; targetDurationSec: number; language: string; imperativeForm: boolean; structure: string }
}

interface AvatarEntry {
  character: string
  characterLabel: string
  scene: string
  sceneLabel: string
  avatarLookId: string
}

interface VideoEntry {
  videoId: string
  character: string
  characterLabel: string
  scene: string
  sceneLabel: string
  avatarLookId: string
  brief: string
  script: string
  headline: string
  cta: string
  orientation: string
  durationSec: number | null
  status: string
  createdAt: string
  heygenPageUrl: string
}

interface Registry {
  version: string
  videos: VideoEntry[]
}

// ---------------------------------------------------------------------------
// Prompt builder — aplica todas as regras da marca Vivr
// ---------------------------------------------------------------------------

function buildHeygenPrompt(brief: BriefFile, avatar: AvatarEntry, copy: CopyBlock): string {
  const script = `${copy.hook} ${copy.body} ${copy.cta}.`

  return `Create a ${durationSec}-second ${orientation} video for the Vivr language learning app.

AVATAR: Use avatar look ID: ${avatar.avatarLookId} (${avatar.characterLabel} — ${avatar.sceneLabel}). Keep the original avatar background.

SCENE: ${brief.visual.scene} — ${brief.visual.mood}.

SCRIPT (narration in Brazilian Portuguese, imperative form):
"${script}"

LAYOUT — 3 fixed zones:
- Zone A (0–15%): vivr logo watermark top-left
- Zone B (15–65%): avatar/scene, subtitles/captions ONLY here — NEVER below this zone
- Zone C (65–100%): dark overlay + headline "${copy.headline}" + CTA button "${copy.cta}"

BRAND GRADIENT (use for CTA button and accent elements — all 6 colors must be visible, do NOT simplify):
linear-gradient(135deg, #f7c948 0%, #f97040 20%, #e94899 45%, #9b5de5 65%, #26c6da 83%, #80e27e 100%)
Colors: yellow-gold (#f7c948), orange (#f97040), hot pink (#e94899), purple (#9b5de5), cyan (#26c6da), mint green (#80e27e) — ALL 6 must appear. Do NOT simplify to fewer colors.

STYLE: Dark background #1A1030, white text, pill-shaped CTA button (border-radius: 100px), Nunito font, premium feel.
IMPORTANT: Subtitles/captions must appear in Zone B only, never over Zone C. CTA button must always be fully visible and never covered by subtitles.`
}

// ---------------------------------------------------------------------------
// HeyGen API call
// ---------------------------------------------------------------------------

async function createVideo(prompt: string, avatarLookId: string): Promise<string> {
  const body = {
    prompt,
    avatar_id: avatarLookId,
    orientation,
    duration_sec: durationSec,
  }

  const res = await fetch('https://api.heygen.com/v2/video/agenerate', {
    method: 'POST',
    headers: {
      'X-Api-Key': HEYGEN_API_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  const json = await res.json() as any
  const videoId = json.data?.video_id ?? json.video_id
  if (!videoId) throw new Error(`HeyGen não retornou video_id: ${JSON.stringify(json)}`)
  return videoId
}

// ---------------------------------------------------------------------------
// Registry helpers
// ---------------------------------------------------------------------------

async function loadRegistry(): Promise<Registry> {
  if (await fs.pathExists(REGISTRY_PATH)) return fs.readJson(REGISTRY_PATH)
  return { version: '1.0', videos: [] }
}

async function saveRegistry(registry: Registry): Promise<void> {
  await fs.writeJson(REGISTRY_PATH, registry, { spaces: 2 })
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  // Load brief
  const briefPath = path.join(BRIEFS_DIR, `${briefId}.json`)
  if (!await fs.pathExists(briefPath)) {
    console.error(`❌ Brief não encontrado: ${briefPath}`)
    process.exit(1)
  }
  const brief: BriefFile = await fs.readJson(briefPath)
  console.log(`\n📋 Brief: ${brief.title}`)

  // Load avatar registry
  const avatarRegistryData: Record<string, AvatarEntry[]> = await fs.readJson(AVATAR_REGISTRY)

  // Determine which characters to process
  const characters = allChars
    ? brief.targetCharacters
    : [characterArg ?? brief.targetCharacters[0]]

  const registry = await loadRegistry()

  for (const character of characters) {
    const avatarList: AvatarEntry[] = avatarRegistryData[character] ?? []
    if (avatarList.length === 0) {
      console.warn(`⚠️  Personagem "${character}" não encontrado no avatar-registry.json`)
      continue
    }

    // Find matching scene or pick first available
    let avatar: AvatarEntry
    if (sceneArg) {
      avatar = avatarList.find(a => a.scene === sceneArg) ?? avatarList[0]
    } else {
      // Pick scene matching the brief's visual.scene, else random
      const matched = avatarList.find(a => a.scene === brief.visual.scene)
      avatar = matched ?? avatarList[Math.floor(Math.random() * avatarList.length)]
    }

    const copy = brief.copy
    const prompt = buildHeygenPrompt(brief, avatar, copy)
    const script = `${copy.hook} ${copy.body} ${copy.cta}.`

    console.log(`\n  → ${avatar.characterLabel} / ${avatar.sceneLabel}`)
    console.log(`     Script: "${script}"`)

    try {
      const videoId = await createVideo(prompt, avatar.avatarLookId)

      const entry: VideoEntry = {
        videoId,
        character: avatar.character,
        characterLabel: avatar.characterLabel,
        scene: avatar.scene,
        sceneLabel: avatar.sceneLabel,
        avatarLookId: avatar.avatarLookId,
        brief: brief.id,
        script,
        headline: copy.headline,
        cta: copy.cta,
        orientation,
        durationSec: null,
        status: 'processing',
        createdAt: new Date().toISOString(),
        heygenPageUrl: `https://app.heygen.com/videos/${videoId}`,
      }

      registry.videos.push(entry)
      console.log(`     ✓ video_id: ${videoId}`)
    } catch (err: any) {
      console.error(`     ❌ Erro ao gerar: ${err.message}`)
    }
  }

  await saveRegistry(registry)
  console.log(`\n✓ Registry salvo em ${REGISTRY_PATH}`)
  console.log(`  Execute "npx ts-node scripts/poll-videos.ts" para checar o status.`)
}

main().catch(err => {
  console.error('\n❌ Erro:', err.message)
  process.exit(1)
})
