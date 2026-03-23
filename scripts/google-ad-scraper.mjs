#!/usr/bin/env node
/**
 * Google Ads Transparency Scraper — Node.js, usa apify~web-scraper (gratuito)
 * Usage: node google-ad-scraper.mjs --advertiser-id AR... [--region BR] [--output summary]
 */

const BASE_URL = 'https://api.apify.com/v2'
const GADS_BASE = 'https://adstransparency.google.com'
const TOKEN = process.env.APIFY_API_TOKEN

if (!TOKEN) { console.error('Error: APIFY_API_TOKEN not set'); process.exit(1) }

const args = process.argv.slice(2)
const get = (flag) => { const i = args.indexOf(flag); return i >= 0 ? args[i + 1] : null }

const advertiserId = get('--advertiser-id')
const region = get('--region') || 'anywhere'
const output = get('--output') || 'summary'

if (!advertiserId) { console.error('Usage: node google-ad-scraper.mjs --advertiser-id AR...'); process.exit(1) }

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

async function pollRun(actorId, runId, timeoutMs = 300000) {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    const data = await apifyGet(`/acts/${actorId}/runs/${runId}`)
    const status = data.data.status
    process.stderr.write(`  [${new Date().toISOString().slice(11,19)}] ${status}\n`)
    if (status === 'SUCCEEDED') return data.data
    if (['FAILED', 'ABORTED', 'TIMED-OUT'].includes(status)) throw new Error(`Run ${status}`)
    await new Promise(r => setTimeout(r, 5000))
  }
  throw new Error('Timed out')
}

async function scrapeAds(advertiserId) {
  const url = `${GADS_BASE}/advertiser/${advertiserId}?region=${region}`
  process.stderr.write(`Scraping: ${url}\n`)

  const runData = await apifyPost(`/acts/apify~puppeteer-scraper/runs`, {
    startUrls: [{ url }],
    pageFunction: `async function pageFunction(context) {
      const { page } = context

      // Wait for page to settle
      await new Promise(r => setTimeout(r, 6000))

      // Try to click "See ads" or dismiss any cookie banner
      await page.evaluate(() => {
        document.querySelectorAll('button').forEach(b => {
          const t = b.textContent.trim().toLowerCase()
          if (t.includes('accept') || t.includes('agree') || t.includes('ok')) b.click()
        })
      })
      await new Promise(r => setTimeout(r, 2000))

      // Scroll down repeatedly to trigger lazy loading
      for (let i = 0; i < 10; i++) {
        await page.evaluate(() => window.scrollBy(0, 1000))
        await new Promise(r => setTimeout(r, 800))
      }
      await new Promise(r => setTimeout(r, 4000))

      const result = await page.evaluate(() => {
        const advertiserName = document.querySelector('advertiser-header .advertiser-name, [class*="advertiser-name"]')?.textContent?.trim()
          || document.querySelector('h1')?.textContent?.trim()

        const ads = []

        // Angular custom elements used by Google Ads Transparency
        const customEls = document.querySelectorAll('creative-preview, ad-card, text-ad-preview, image-ad-preview, video-ad-preview, display-ad-preview')
        customEls.forEach(el => {
          const ad = { format: el.tagName.toLowerCase(), raw: el.outerHTML.slice(0, 800) }
          const headline = el.querySelector('[class*="headline"], [class*="title"], h1, h2, h3')
          if (headline) ad.headline = headline.textContent.trim()
          const desc = el.querySelector('[class*="description"], [class*="body"], p')
          if (desc) ad.description = desc.textContent.trim()
          const img = el.querySelector('img')
          if (img?.src) ad.image_url = img.src
          ads.push(ad)
        })

        // Fallback: look for card-like containers with ad content
        if (ads.length === 0) {
          document.querySelectorAll('mat-card, .card, [class*="creative"], [class*="ad-item"]').forEach(el => {
            const text = el.innerText?.trim()
            if (text && text.length > 15 && text.length < 500) {
              ads.push({ format: 'CARD', text: text.slice(0, 200), raw: el.outerHTML.slice(0, 400) })
            }
          })
        }

        // Dump page structure for debugging
        const bodyHtml = document.body.innerHTML.slice(0, 3000)
        const customTagsUsed = [...new Set([...document.querySelectorAll('*')].map(e => e.tagName.toLowerCase()).filter(t => t.includes('-')))]

        return { advertiser_name: advertiserName, ads, body_sample: bodyHtml, custom_tags: customTagsUsed }
      })

      return result
    }`,
    proxyConfiguration: { useApifyProxy: true },
    maxRequestsPerCrawl: 1
  })

  const runId = runData.data.id
  process.stderr.write(`Run started: ${runId}\n`)
  const runResult = await pollRun('apify~puppeteer-scraper', runId, 300000)

  const items = await apifyGet(`/datasets/${runResult.defaultDatasetId}/items`)
  return items
}

function formatSummary(items) {
  const lines = []

  for (const item of items) {
    if (item.advertiser_name) lines.push(`\nAdvertiser: ${item.advertiser_name}`)
    if (item.page_title) lines.push(`Page: ${item.page_title}`)
    if (item.total_found !== undefined) lines.push(`Total elements found: ${item.total_found}\n`)

    const ads = item.ads || []
    if (ads.length > 0) {
      lines.push(`${'#'.padEnd(4)} ${'Format'.padEnd(12)} Ad Content`)
      lines.push('-'.repeat(80))
      ads.forEach((ad, i) => {
        const fmt = String(ad.format || '').padEnd(12)
        const text = (ad.headline || ad.description || ad.text || '').slice(0, 60).replace(/\n/g, ' ')
        lines.push(`${String(i + 1).padEnd(4)} ${fmt} ${text}`)
        if (ad.description && ad.headline) {
          lines.push(`     ${' '.repeat(12)} ${ad.description.slice(0, 60)}`)
        }
        if (ad.image_url) lines.push(`     ${' '.repeat(12)} [img] ${ad.image_url.slice(0, 60)}`)
      })
    }
  }

  return lines.join('\n') || JSON.stringify(items, null, 2)
}

async function main() {
  const ids = advertiserId.split(',').map(s => s.trim())
  process.stderr.write(`Advertiser ID(s): ${ids.join(', ')}\n`)

  const items = await scrapeAds(ids[0])

  if (output === 'summary') {
    console.log(formatSummary(items))
  } else {
    console.log(JSON.stringify(items, null, 2))
  }
}

main().catch(err => { console.error(err.message); process.exit(1) })