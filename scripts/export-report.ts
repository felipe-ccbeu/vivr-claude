/**
 * export-report.ts
 *
 * Gera um relatório Markdown dos vídeos prontos no video-registry.json.
 * Salva em outputs/reports/YYYY-MM-DD-batch.md
 *
 * Usage:
 *   npx ts-node scripts/export-report.ts
 *   npx ts-node scripts/export-report.ts --date 2026-04-08   ← filtra por data
 *   npx ts-node scripts/export-report.ts --all               ← inclui falhas e pendentes
 */

import * as fs from 'fs-extra'
import * as path from 'path'

const REGISTRY_PATH = path.resolve('outputs/heygen/video-registry.json')
const REPORTS_DIR   = path.resolve('outputs/reports')

const args = process.argv.slice(2)
const getArg = (flag: string) => { const i = args.indexOf(flag); return i !== -1 ? args[i + 1] : undefined }
const hasFlag = (flag: string) => args.includes(flag)

const filterDate = getArg('--date') ?? new Date().toISOString().slice(0, 10)
const showAll    = hasFlag('--all')

interface VideoEntry {
  videoId: string
  character: string
  characterLabel: string
  scene: string
  sceneLabel: string
  brief: string
  script: string
  headline: string
  cta: string
  orientation: string
  durationSec: number | null
  status: string
  createdAt: string
  completedAt?: string
  heygenPageUrl: string
  videoUrl?: string
  thumbnailUrl?: string
  failureMessage?: string
}

function formatDuration(sec: number | null): string {
  if (sec == null) return '—'
  return `${sec.toFixed(1)}s`
}

function statusEmoji(status: string): string {
  return status === 'completed' ? '✅' : status === 'failed' ? '❌' : '⏳'
}

async function main() {
  if (!await fs.pathExists(REGISTRY_PATH)) {
    console.error('❌ video-registry.json não encontrado.')
    process.exit(1)
  }

  const registry = await fs.readJson(REGISTRY_PATH)
  const videos: VideoEntry[] = registry.videos ?? []

  // Filter by date (createdAt starts with filterDate) unless --all
  const filtered = showAll
    ? videos
    : videos.filter(v => v.createdAt.startsWith(filterDate))

  if (filtered.length === 0) {
    console.log(`Nenhum vídeo encontrado para ${filterDate}. Use --all para ver todos.`)
    return
  }

  const completed = filtered.filter(v => v.status === 'completed')
  const failed    = filtered.filter(v => v.status === 'failed')
  const pending   = filtered.filter(v => v.status === 'pending' || v.status === 'processing')

  // Build report
  const lines: string[] = []

  lines.push(`# Relatório de Vídeos HeyGen — ${filterDate}`)
  lines.push('')
  lines.push(`**Total:** ${filtered.length} vídeos  |  ✅ ${completed.length} prontos  |  ❌ ${failed.length} falhas  |  ⏳ ${pending.length} pendentes`)
  lines.push('')

  if (completed.length > 0) {
    lines.push('## ✅ Prontos')
    lines.push('')
    lines.push('| Personagem | Cena | Brief | Duração | Roteiro | Link |')
    lines.push('|---|---|---|---|---|---|')
    for (const v of completed) {
      const script = v.script.length > 60 ? v.script.slice(0, 57) + '...' : v.script
      lines.push(`| ${v.characterLabel} | ${v.sceneLabel} | ${v.brief} | ${formatDuration(v.durationSec)} | ${script} | [assistir](${v.heygenPageUrl}) |`)
    }
    lines.push('')
  }

  if (failed.length > 0) {
    lines.push('## ❌ Falhas')
    lines.push('')
    for (const v of failed) {
      lines.push(`- **${v.characterLabel}** / ${v.sceneLabel} — ${v.failureMessage ?? 'unknown error'}`)
    }
    lines.push('')
  }

  if (pending.length > 0) {
    lines.push('## ⏳ Pendentes / Processando')
    lines.push('')
    for (const v of pending) {
      lines.push(`- **${v.characterLabel}** / ${v.sceneLabel} → [${v.videoId}](${v.heygenPageUrl})`)
    }
    lines.push('')
  }

  lines.push('---')
  lines.push('')
  lines.push('## Roteiros completos')
  lines.push('')
  for (const v of completed) {
    lines.push(`### ${v.characterLabel} — ${v.sceneLabel}`)
    lines.push(`- **Brief:** ${v.brief}`)
    lines.push(`- **Headline:** ${v.headline}`)
    lines.push(`- **CTA:** ${v.cta}`)
    lines.push(`- **Script:** "${v.script}"`)
    lines.push(`- **Duração:** ${formatDuration(v.durationSec)}`)
    lines.push(`- **Link:** [${v.heygenPageUrl}](${v.heygenPageUrl})`)
    lines.push('')
  }

  lines.push(`_Gerado em ${new Date().toISOString()}_`)

  // Save
  await fs.ensureDir(REPORTS_DIR)
  const filename = `${filterDate}-batch.md`
  const outputPath = path.join(REPORTS_DIR, filename)
  await fs.writeFile(outputPath, lines.join('\n'), 'utf-8')

  console.log(`\n✓ Relatório salvo: ${outputPath}`)
  console.log(`  ${completed.length} vídeos prontos, ${failed.length} falhas, ${pending.length} pendentes.`)
}

main().catch(err => {
  console.error('\n❌ Erro:', err.message)
  process.exit(1)
})
