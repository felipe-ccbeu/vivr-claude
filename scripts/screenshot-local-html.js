const { chromium } = require('playwright');
const path = require('path');

async function main() {
  const html = process.argv[2];

  if (!html) {
    console.error('Uso: node scripts/screenshot-local-html.js caminho/do/arquivo.html');
    process.exit(1);
  }

  const png = html.replace(/\.html$/i, '.png');

  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 540, height: 675 }
  });

  await page.goto('file://' + path.resolve(html));
  await page.waitForTimeout(800);

  await page.screenshot({
    path: png,
    clip: { x: 0, y: 0, width: 540, height: 675 }
  });

  await browser.close();
  console.log('Salvo:', png);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});