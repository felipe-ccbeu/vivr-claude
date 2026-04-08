/**
 * poll-videos.ts
 *
 * Checa o status de todos os vídeos com status "processing" ou "pending"
 * no video-registry.json e atualiza com o resultado final.
 *
 * Usage:
 *   npx ts-node scripts/poll-videos.ts
 *   npx ts-node scripts/poll-videos.ts --all   ← checa todos, inclusive completed
 */

import * as dotenv from 'dotenv'
import * as fs from 'fs-extra'
import * as path from 'path'
import fetch from 'node-fetch'

dotenv.config()

const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY
if (!HEYGEN_API_KEY) throw new Error('HEYGEN_API_KEY não encontrada no .env')

const REGISTRY_PATH = path.resolve('outputs/heygen/video-registry.json')

const args = process.argv.slice(2)
const checkAll = args.includes('--all')

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
  status: 'pending' | 'processing' | 'completed' | 'failed'
  createdAt: string
  completedAt?: string
  heygenPageUrl: string
  videoUrl?: string
  thumbnailUrl?: string
  failureMessage?: string
}

interface Registry {
  version: string
  videos: VideoEntry[]
}

async function getVideoStatus(videoId: string): Promise<any> {
  const res = await fetch(`https://api.heygen.com/v2/videos/${videoId}`, {
    headers: { 'X-Api-Key': HEYGEN_API_KEY! },
  })
  const json = await res.json() as any
  return json.data ?? json
}

async function main() {
  if (!await fs.pathExists(REGISTRY_PATH)) {
    console.error('❌ video-registry.json não encontrado em outputs/heygen/')
    process.exit(1)
  }

  const registry: Registry = await fs.readJson(REGISTRY_PATH)
  const toCheck = checkAll
    ? registry.videos
    : registry.videos.filter(v => v.status === 'pending' || v.status === 'processing')

  if (toCheck.length === 0) {
    console.log('✓ Nenhum vídeo pendente. Use --all para checar todos.')
    return
  }

  console.log(`\nChecando ${toCheck.length} vídeo(s)...\n`)

  let updated = 0

  for (const entry of toCheck) {
    process.stdout.write(`  ${entry.characterLabel} / ${entry.scene} → `)

    try {
      const data = await getVideoStatus(entry.videoId)
      const status = data.status

      entry.status = status

      if (status === 'completed') {
        entry.durationSec = data.duration ?? entry.durationSec
        entry.videoUrl = data.video_url ?? undefined
        entry.thumbnailUrl = data.thumbnail_url ?? undefined
        entry.completedAt = data.completed_at
          ? new Date(data.completed_at * 1000).toISOString()
          : new Date().toISOString()
        console.log(`✓ completed (${entry.durationSec?.toFixed(1)}s)`)
        updated++
      } else if (status === 'failed') {
        entry.failureMessage = data.failure_message ?? 'unknown'
        console.log(`✗ failed — ${entry.failureMessage}`)
        updated++
      } else {
        console.log(`⏳ ${status}`)
      }
    } catch (err: any) {
      console.log(`❌ erro: ${err.message}`)
    }
  }

  if (updated > 0) {
    await fs.writeJson(REGISTRY_PATH, registry, { spaces: 2 })
    console.log(`\n✓ Registry atualizado (${updated} vídeo(s) alterados).`)
  } else {
    console.log('\n— Nenhuma alteração.')
  }
}

main().catch(err => {
  console.error('\n❌ Erro:', err.message)
  process.exit(1)
})
