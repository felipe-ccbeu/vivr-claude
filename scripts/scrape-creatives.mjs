#!/usr/bin/env node
/**
 * Visita cada creative page do Google Ads Transparency e extrai copy + metadados
 * Usage: node scrape-creatives.mjs
 */

const BASE_URL = 'https://api.apify.com/v2'
const GADS_BASE = 'https://adstransparency.google.com'
const TOKEN = process.env.APIFY_API_TOKEN
const ADVERTISER_ID = 'AR01320432650854334465'
const REGION = 'BR'

if (!TOKEN) { console.error('Error: APIFY_API_TOKEN not set'); process.exit(1) }

const args = process.argv.slice(2)
const maxCreatives = parseInt(args.find(a => a.startsWith('--max='))?.split('=')[1] || '101')
const outputFile = args.find(a => a.startsWith('--out='))?.split('=')[1] || 'outputs/duolingo-br-ads.json'

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

async function pollRun(actorId, runId, timeoutMs = 600000) {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    const data = await apifyGet(`/acts/${actorId}/runs/${runId}`)
    const status = data.data.status
    process.stderr.write(`  [${new Date().toISOString().slice(11,19)}] ${status}\n`)
    if (status === 'SUCCEEDED') return data.data
    if (['FAILED', 'ABORTED', 'TIMED-OUT'].includes(status)) throw new Error(`Run ${status}`)
    await new Promise(r => setTimeout(r, 6000))
  }
  throw new Error('Timed out')
}

// Creative IDs extracted from previous scrape
const CREATIVE_IDS = [
  'CR04376597246859280385','CR11720420126728650753','CR08392678426405765121',
  'CR00990928154384138241','CR12258560699780825089','CR16447370148119052289',
  'CR07332044919902568449','CR14698326243892264961','CR08074942964960329729',
  'CR05686368302826258433','CR06417969407074500609','CR08608896597733933057',
  'CR08032435845430509569','CR04074443454317330433','CR11360704701449371649',
  'CR02376023444845232129','CR13087746123873910785','CR04153116191344295937',
  'CR10488544891154464769','CR06423943947101405185','CR16939067238344818689',
  'CR04306193206640377857','CR14470666503025852417'
]

async function scrapeCreatives(creativeIds) {
  const startUrls = creativeIds.map(id => ({
    url: `${GADS_BASE}/advertiser/${ADVERTISER_ID}/creative/${id}?region=${REGION}`,
    userData: { creativeId: id }
  }))

  process.stderr.write(`Visiting ${startUrls.length} creative pages...\n`)

  const runData = await apifyPost(`/acts/apify~puppeteer-scraper/runs`, {
    startUrls,
    pageFunction: `async function pageFunction(context) {
      const { page, request } = context
      const creativeId = request.userData?.creativeId || ''

      await new Promise(r => setTimeout(r, 5000))

      // Scroll a bit
      await page.evaluate(() => window.scrollBy(0, 500))
      await new Promise(r => setTimeout(r, 2000))

      const data = await page.evaluate(() => {
        const getText = (sel) => document.querySelector(sel)?.textContent?.trim() || ''
        const getAll = (sel) => [...document.querySelectorAll(sel)].map(e => e.textContent.trim()).filter(Boolean)

        // Ad format detection
        const isVideo = !!document.querySelector('video, [class*="video"], fletch-renderer')
        const isText = !!document.querySelector('text-ad, [class*="text-ad"]')
        const isDisplay = !!document.querySelector('html-renderer, [class*="html-ad"]')

        // Headlines & descriptions (Search ads)
        const headlines = getAll('[class*="headline"], .headline, h1, h2, h3, .ad-headline').filter(t => t.length < 100)
        const descriptions = getAll('[class*="description"], .description, .ad-description, p').filter(t => t.length > 5 && t.length < 300)

        // Dates and impression info
        const dates = getAll('[class*="date"], time, .date-range, [class*="shown"]')
        const impressions = getText('[class*="impression"], [class*="reach"]')

        // Image
        const img = document.querySelector('img[src*="googleusercontent"], img[src*="gstatic"], img[src*="googlesyndication"]')
        const video = document.querySelector('video')
        const ytThumb = document.querySelector('img[src*="ytimg"]')

        // Full visible text (fallback)
        const bodyText = document.body.innerText?.slice(0, 1000) || ''

        return {
          format: isVideo ? 'VIDEO' : isText ? 'TEXT' : isDisplay ? 'DISPLAY' : 'UNKNOWN',
          headlines,
          descriptions,
          dates,
          impressions,
          image_url: img?.src || ytThumb?.src || null,
          video_src: video?.src || null,
          page_title: document.title,
          body_text: bodyText
        }
      })

      return { creative_id: creativeId, url: request.url, ...data }
    }`,
    proxyConfiguration: { useApifyProxy: true },
    maxConcurrency: 5,
    maxRequestsPerCrawl: creativeIds.length
  })

  const runId = runData.data.id
  process.stderr.write(`Run started: ${runId}\n`)
  const runResult = await pollRun('apify~puppeteer-scraper', runId, 600000)

  const items = await apifyGet(`/datasets/${runResult.defaultDatasetId}/items`)
  process.stderr.write(`Fetched ${items.length} creatives.\n`)
  return items
}

function formatReport(creatives) {
  const lines = ['=== DUOLINGO BR — AD CREATIVE REPORT ===', '']

  const byFormat = {}
  creatives.forEach(c => {
    const fmt = c.format || 'UNKNOWN'
    if (!byFormat[fmt]) byFormat[fmt] = []
    byFormat[fmt].push(c)
  })

  Object.entries(byFormat).forEach(([fmt, ads]) => {
    lines.push(`\n--- ${fmt} ADS (${ads.length}) ---`)
    ads.forEach((ad, i) => {
      lines.push(`\n[${i+1}] ${ad.creative_id}`)
      if (ad.headlines?.length) lines.push(`  Headlines: ${ad.headlines.slice(0,3).join(' | ')}`)
      if (ad.descriptions?.length) lines.push(`  Copy: ${ad.descriptions.slice(0,2).join(' | ')}`)
      if (ad.image_url) lines.push(`  Image: ${ad.image_url.slice(0,80)}`)
      if (ad.dates?.length) lines.push(`  Dates: ${ad.dates.slice(0,2).join(', ')}`)
      // Fallback: show body_text snippet if no structured data
      if (!ad.headlines?.length && !ad.descriptions?.length && ad.body_text) {
        const snippet = ad.body_text.replace(/\s+/g, ' ').slice(0, 150)
        lines.push(`  Text: ${snippet}`)
      }
    })
  })

  lines.push(`\n\nTotal: ${creatives.length} creatives`)
  return lines.join('\n')
}

async function main() {
  const ids = CREATIVE_IDS.slice(0, maxCreatives)
  process.stderr.write(`Scraping ${ids.length} creatives for Duolingo BR\n\n`)

  const creatives = await scrapeCreatives(ids)

  // Save JSON
  const fs = await import('fs')
  const path = await import('path')
  const dir = path.dirname(outputFile)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(outputFile, JSON.stringify(creatives, null, 2))
  process.stderr.write(`\nJSON saved to ${outputFile}\n`)

  // Print report
  console.log(formatReport(creatives))
}

main().catch(err => { console.error(err.message); process.exit(1) })