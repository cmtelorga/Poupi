// Gera os ícones PNG a partir de public/icons/icon.svg (usa o Chromium do Playwright).
// Uso: npm run icons   (requer o pacote "playwright" instalado, local ou global via NODE_PATH)
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';

const { chromium } = createRequire(import.meta.url)('playwright');

const svg = readFileSync(new URL('../public/icons/icon.svg', import.meta.url), 'utf8');
const out = (name) => new URL(`../public/icons/${name}`, import.meta.url).pathname;
const browser = await chromium.launch();
const page = await browser.newPage();

const render = async (size, file, { pad = 0, bg = 'transparent' } = {}) => {
  await page.setViewportSize({ width: size, height: size });
  const inner = size - pad * 2;
  await page.setContent(`<html><body style="margin:0;background:${bg}">
    <div style="width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center">
      <div style="width:${inner}px;height:${inner}px">${svg.replace('<svg ', `<svg width="${inner}" height="${inner}" `)}</div>
    </div></body></html>`);
  await page.screenshot({ path: out(file), omitBackground: bg === 'transparent' });
};

await render(192, 'icon-192.png');
await render(512, 'icon-512.png');
await render(180, 'apple-touch-icon.png', { bg: '#7c3aed' });
await render(512, 'icon-maskable-512.png', { pad: 56, bg: '#7c3aed' });
await browser.close();
console.log('Ícones gerados.');
