const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function main() {
  const htmlArg = process.argv[2];

  if (!htmlArg) {
    console.error('Uso: node scripts/screenshot-local-html.js caminho/do/arquivo.html');
    process.exit(1);
  }

  const htmlPath = path.resolve(htmlArg);

  if (!fs.existsSync(htmlPath)) {
    console.error('Arquivo não encontrado:', htmlPath);
    process.exit(1);
  }

  if (!htmlPath.match(/\.html?$/i)) {
    console.error('O arquivo informado não é um HTML:', htmlPath);
    process.exit(1);
  }

  const pngPath = htmlPath.replace(/\.html?$/i, '.png');

  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 540, height: 675 }
  });

  await page.goto('file://' + htmlPath, {
    waitUntil: 'load'
  });

  await page.waitForTimeout(800);

  await page.screenshot({
    path: pngPath,
    clip: {
      x: 0,
      y: 0,
      width: 540,
      height: 675
    }
  });

  await browser.close();
  console.log('Salvo:', pngPath);
}

main().catch((err) => {
  console.error('Erro ao gerar screenshot:');
  console.error(err);
  process.exit(1);
});