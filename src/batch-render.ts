import * as fs from 'fs-extra'
import * as path from 'path'
import { ContentJSON, TemplateName } from './content-schema'
import { renderFromContent, TEMPLATE_SIZE, RenderMeta } from './renderer'
import { exportPNG } from './screenshot'
import { DesignVariation } from './styles'

/**
 * BATCH-RENDER — CLI para gerar múltiplos templates em um único comando.
 * Orquestra chamadas a renderFromContent() para cada template,
 * economizando tempo ao gerar variações de um mesmo campaign.
 *
 * Uso:
 *   npx ts-node src/batch-render.ts \
 *     --campaign outputs/campaigns/010/content-feed-light-arc.json \
 *     --templates light-arc,cinematic \
 *     --variation dark-bold \
 *     --out outputs/campaigns/010
 */

/**
 * Parse de argumentos simples (--key value) sem deps externas
 */
function parseArgs(argv: string[]): Record<string, string> {
  const result: Record<string, string> = {}
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) {
      const key = argv[i].slice(2)
      const value = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : ''
      result[key] = value
      if (value) i++ // skip next arg se foi consumido como value
    }
  }
  return result
}

/**
 * Executa batch rendering para múltiplos templates.
 * Cada template é salvo em seu próprio subdiretório (outDir/light-arc, outDir/cinematic).
 */
interface BatchRenderOptions {
  campaignPath: string
  templates: TemplateName[]
  variation?: string
  outDir: string
}

async function runBatch(opts: BatchRenderOptions): Promise<string[]> {
  console.log(`[batch-render] Loading campaign: ${opts.campaignPath}`)

  // 1. Load base ContentJSON
  const base: ContentJSON = await fs.readJson(opts.campaignPath)
  console.log(`[batch-render] Campaign ID: ${base.campaignId} | Variants: ${base.variants.length}`)

  const allPaths: string[] = []

  // 2. Para cada template, renderizar
  for (const templateName of opts.templates) {
    console.log(`\n[batch-render] Rendering template: ${templateName}`)

    // Clone do content, sobrescrever template
    const content: ContentJSON = {
      ...base,
      template: templateName,
      designVariation: (opts.variation || base.designVariation || 'dark-bold') as DesignVariation,
    }

    // Output subdir por template
    const templateOutDir = path.join(opts.outDir, templateName)
    await fs.ensureDir(templateOutDir)

    try {
      // Renderizar HTML com metadata
      const meta: RenderMeta = {
        campaignId: base.campaignId,
        template: templateName,
        designVariation: content.designVariation || 'dark-bold',
        variantIndex: 0, // Será sobrescrito no loop de renderFromContent
        generatedAt: new Date().toISOString(),
      }

      const htmlPaths = await renderFromContent(content, templateOutDir, {
        meta,
        imageBaseDir: opts.outDir,  // outDir is where scene.png exists (campaign root)
      })
      console.log(`[batch-render]   HTML: ${htmlPaths.length} files`)

      // Screenshot → PNG
      const size = TEMPLATE_SIZE[templateName]
      for (let i = 0; i < htmlPaths.length; i++) {
        const htmlPath = htmlPaths[i]
        const pngPath = htmlPath.replace('.html', '.png')
        await exportPNG(htmlPath, pngPath, size)
        console.log(`[batch-render]   PNG #${i + 1}: ${path.basename(pngPath)}`)
        allPaths.push(pngPath)
      }

      allPaths.push(...htmlPaths)
    } catch (err) {
      console.error(`[batch-render] ERROR rendering ${templateName}:`, err)
      throw err
    }
  }

  return allPaths
}

/**
 * Gera um index.html visual com grade dos PNGs, agrupado por template.
 */
async function generateIndexHTML(
  campaignId: string,
  outDir: string,
  allPaths: string[],
  content: ContentJSON
): Promise<string> {
  console.log(`\n[batch-render] Generating index.html...`)

  // Separar PNGs por template
  const byTemplate: Record<string, string[]> = {}
  for (const filePath of allPaths) {
    if (filePath.endsWith('.png')) {
      // Extract template name from path: outDir/light-arc/post-copy-1.png
      const parts = filePath.split(path.sep)
      const idx = parts.indexOf(path.basename(outDir))
      if (idx >= 0 && idx + 1 < parts.length) {
        const templateName = parts[idx + 1]
        if (!byTemplate[templateName]) {
          byTemplate[templateName] = []
        }
        byTemplate[templateName].push(filePath)
      }
    }
  }

  // Build HTML
  let html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Campaign: ${campaignId}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #0d0d0d; color: #fff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 32px; }
    h1 { font-size: 24px; margin-bottom: 32px; font-weight: 600; letter-spacing: -0.02em; }
    h2 { font-size: 13px; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255,255,255,0.4); margin: 40px 0 16px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.1); }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 32px; }
    .card { background: #1a1a1a; border-radius: 8px; overflow: hidden; transition: transform 0.2s ease; }
    .card:hover { transform: translateY(-2px); }
    .card img { width: 100%; display: block; }
    .card-meta { padding: 12px; font-size: 11px; color: rgba(255,255,255,0.5); line-height: 1.4; }
    .card-meta strong { color: rgba(255,255,255,0.8); display: block; margin-bottom: 4px; }
    .card-meta a { color: #f97040; text-decoration: none; }
    .card-meta a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <h1>📊 ${campaignId}</h1>
`

  // For each template group
  const sortedTemplates = Object.keys(byTemplate).sort()
  for (const templateName of sortedTemplates) {
    const pngPaths = byTemplate[templateName].sort()

    html += `  <h2>${templateName}</h2>\n`
    html += `  <div class="grid">\n`

    for (let i = 0; i < pngPaths.length; i++) {
      const pngPath = pngPaths[i]
      const relPath = path.relative(outDir, pngPath).replace(/\\/g, '/') // Windows → forward slashes

      const variantIndex = i + 1
      const variant = content.variants[i]
      const hookPreview = variant.hook.slice(0, 40) + (variant.hook.length > 40 ? '...' : '')
      const headlinePreview = variant.headline.slice(0, 30) + (variant.headline.length > 30 ? '...' : '')

      html += `    <div class="card">
      <img src="${relPath}" alt="${templateName} variant ${variantIndex}">
      <div class="card-meta">
        <strong>P${variantIndex}</strong>
        <div>${headlinePreview}</div>
        <a href="${relPath.replace('.png', '.html')}" target="_blank">View HTML →</a>
      </div>
    </div>\n`
    }

    html += `  </div>\n`
  }

  html += `</body>\n</html>`

  const indexPath = path.join(outDir, 'index.html')
  await fs.writeFile(indexPath, html, 'utf-8')
  console.log(`[batch-render] Index saved: ${indexPath}`)

  return indexPath
}

/**
 * Main CLI entrypoint
 */
async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2))

  if (!args.campaign) {
    console.error(`
Usage:
  npx ts-node src/batch-render.ts \\
    --campaign <path-to-content-feed.json> \\
    --templates <name1,name2,...> \\
    [--variation <design-variation>] \\
    [--out <output-dir>]

Example:
  npx ts-node src/batch-render.ts \\
    --campaign outputs/campaigns/010/content-feed-light-arc.json \\
    --templates light-arc,cinematic \\
    --variation dark-bold \\
    --out outputs/campaigns/010
    `)
    process.exit(1)
  }

  const campaignPath = path.resolve(args.campaign)
  const templateNames = (args.templates ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean) as TemplateName[]
  const outDir = args.out ? path.resolve(args.out) : path.dirname(campaignPath)

  if (templateNames.length === 0) {
    console.error('[batch-render] --templates is required (e.g. --templates light-arc,cinematic)')
    process.exit(1)
  }

  try {
    // 1. Run batch
    const allPaths = await runBatch({ campaignPath, templates: templateNames, variation: args.variation, outDir })

    // 2. Load content again for index generation
    const content: ContentJSON = await fs.readJson(campaignPath)

    // 3. Generate index
    await generateIndexHTML(content.campaignId, outDir, allPaths, content)

    console.log(`\n✅ [batch-render] Done!`)
    console.log(`   Total files: ${allPaths.length}`)
    console.log(`   Output: ${outDir}`)
  } catch (err) {
    console.error('[batch-render] Fatal error:', err)
    process.exit(1)
  }
}

main()
