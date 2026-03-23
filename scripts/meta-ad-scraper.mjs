#!/usr/bin/env node
/**
 * Meta Ad Library Scraper — Node.js port
 * Usage: node meta-ad-scraper.mjs --company "Duolingo" --country BR --output summary
 */

const BASE_URL = 'https://api.apify.com/v2'
const ACTOR_ID = 'apify~facebook-ads-scraper'
const TOKEN = process.env.APIFY_API_TOKEN

if (!TOKEN) { console.error('Error: APIFY_API_TOKEN not set'); process.exit(1) }

const args = process.argv.slice(2)
const get = (flag) => { const i = args.indexOf(flag); return i >= 0 ? args[i + 1] : null }

const company  = get('--company')
const pageUrl  = get('--page-url')
const country  = get('--country') || 'ALL'
const status   = get('--ad-status') || 'active'
const maxAds   = parseInt(get('--max-ads') || '50')
const output   = get('--output') || 'summary'

if (!company && !pageUrl) { console.error('Usage: node meta-ad-scraper.mjs --company "Name"'); process.exit(1) }

async function apifyPost(path, body) {
  const res = await fetch(`${BASE_URL}${path}?token=${TOKEN}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
  })
  if (!res.ok) throw new Error(`POST ${path}: ${res.status} ${await res.text()}`)
  return res.json()
}

async function apifyGet(path) {
  const res = await fetch(`${BASE_URL}${path}?token=${TOKEN}`)
  if (!res.ok) throw new Error(`GET ${path}: ${res.status} ${await res.text()}`)
  return res.json()
}

async function pollRun(runId, timeoutMs = 300000) {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    const data = await apifyGet(`/acts/${ACTOR_ID}/runs/${runId}`)
    const status = data.data.status
    process.stderr.write(`  [${new Date().toISOString().slice(11,19)}] ${status}\n`)
    if (status === 'SUCCEEDED') return data.data
    if (['FAILED', 'ABORTED', 'TIMED-OUT'].includes(status)) throw new Error(`Run ${status}: ${JSON.stringify(data.data)}`)
    await new Promise(r => setTimeout(r, 5000))
  }
  throw new Error('Timed out')
}

async function scrapeAds() {
  // Build Ad Library search URL
  const searchTerm = company || pageUrl
  const countryParam = country === 'ALL' ? 'ALL' : country
  const statusParam = status === 'all' ? '' : '&active_status=active'

  let adLibraryUrl
  if (pageUrl) {
    adLibraryUrl = pageUrl
  } else {
    adLibraryUrl = `https://www.facebook.com/ads/library/?active_status=${status === 'all' ? 'all' : 'active'}&ad_type=all&country=${countryParam}&q=${encodeURIComponent(company)}&search_type=keyword_unordered`
  }

  process.stderr.write(`Searching Meta Ad Library: ${searchTerm}\n`)
  process.stderr.write(`Country: ${countryParam} | Status: ${status} | Max: ${maxAds}\n\n`)

  const runData = await apifyPost(`/acts/${ACTOR_ID}/runs`, {
    startUrls: [{ url: adLibraryUrl }],
    maxResults: maxAds,
    proxyConfiguration: { useApifyProxy: true }
  })

  const runId = runData.data.id
  process.stderr.write(`Run started: ${runId}\n`)
  const runResult = await pollRun(runId, 300000)

  const items = await apifyGet(`/datasets/${runResult.defaultDatasetId}/items`)
  process.stderr.write(`Fetched ${items.length} ads.\n\n`)
  return items
}

function formatSummary(ads) {
  const lines = [`=== META ADS — ${company || pageUrl} (${country}) ===`, '']

  if (ads.length === 0) {
    lines.push('Nenhum anúncio encontrado.')
    return lines.join('\n')
  }

  // Group by platform
  const platforms = {}
  ads.forEach(ad => {
    const plats = ad.platforms || ad.publisherPlatforms || ['unknown']
    plats.forEach(p => {
      if (!platforms[p]) platforms[p] = 0
      platforms[p]++
    })
  })
  lines.push(`Plataformas: ${Object.entries(platforms).map(([k,v]) => `${k}(${v})`).join(', ')}`)
  lines.push(`Total: ${ads.length} anúncios\n`)

  // Spend range
  const withSpend = ads.filter(a => a.spend_lower || a.spendLower)
  if (withSpend.length > 0) {
    const totalMin = withSpend.reduce((s,a) => s + (a.spend_lower || a.spendLower || 0), 0)
    const totalMax = withSpend.reduce((s,a) => s + (a.spend_upper || a.spendUpper || 0), 0)
    lines.push(`Gasto estimado: $${totalMin.toLocaleString()} – $${totalMax.toLocaleString()} (${withSpend.length} ads com dados)\n`)
  }

  lines.push(`${'#'.padEnd(4)} ${'Status'.padEnd(8)} ${'Plataformas'.padEnd(20)} Copy`)
  lines.push('-'.repeat(90))

  ads.forEach((ad, i) => {
    const st = String(ad.status || ad.adStatus || '').slice(0,7).padEnd(8)
    const plats = (ad.platforms || ad.publisherPlatforms || []).join(',').slice(0,19).padEnd(20)
    const copy = (
      ad.ad_text || ad.adText || ad.body ||
      ad.ad_creative_link_title || ad.linkTitle ||
      ad.ad_creative_link_description || ad.linkDescription || ''
    ).replace(/\n/g, ' ').slice(0, 55)
    lines.push(`${String(i+1).padEnd(4)} ${st} ${plats} ${copy}`)
  })

  lines.push('\n--- COPY COMPLETO (top 10) ---')
  ads.slice(0, 10).forEach((ad, i) => {
    const copy = ad.ad_text || ad.adText || ad.body || ''
    const title = ad.ad_creative_link_title || ad.linkTitle || ''
    const desc = ad.ad_creative_link_description || ad.linkDescription || ''
    const img = ad.image_url || ad.imageUrl || ad.snapshot?.images?.[0]?.originalImageUrl || ''
    const video = ad.video_url || ad.videoUrl || ad.snapshot?.videos?.[0]?.videoHdUrl || ''
    const start = ad.ad_delivery_start_time || ad.startDate || ''
    const spend = ad.spend_lower ? `$${ad.spend_lower}–$${ad.spend_upper}` : ''

    lines.push(`\n[${i+1}] ${ad.page_name || ad.pageName || ''} | ${start} ${spend}`)
    if (title) lines.push(`  Título: ${title}`)
    if (desc)  lines.push(`  Desc:   ${desc}`)
    if (copy)  lines.push(`  Copy:   ${copy.slice(0, 200)}`)
    if (img)   lines.push(`  Img:    ${img.slice(0, 80)}`)
    if (video) lines.push(`  Video:  ${video.slice(0, 80)}`)
  })

  return lines.join('\n')
}

async function main() {
  const ads = await scrapeAds()

  const fs = await import('fs')
  fs.writeFileSync('outputs/duolingo-meta-ads.json', JSON.stringify(ads, null, 2))
  process.stderr.write('JSON salvo em outputs/duolingo-meta-ads.json\n')

  if (output === 'summary') {
    console.log(formatSummary(ads))
  } else {
    console.log(JSON.stringify(ads, null, 2))
  }
}

main().catch(err => { console.error(err.message); process.exit(1) })