import { chromium } from 'playwright'
import * as path from 'path'

export async function exportPNG(
  htmlPath: string,
  outputPath: string,
  size: { width: number; height: number } = { width: 540, height: 675 }
): Promise<void> {
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.setViewportSize({ width: size.width, height: size.height })

  const absolutePath = path.resolve(htmlPath)
  await page.goto(`file://${absolutePath}`)

  // wait for fonts to load
  await page.waitForTimeout(500)

  await page.screenshot({
    path: outputPath,
    clip: { x: 0, y: 0, width: size.width, height: size.height },
  })

  await browser.close()
  console.log(`[screenshot] PNG saved at ${outputPath}`)
}