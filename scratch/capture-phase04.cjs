const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const shots = [
    ['home', 'http://127.0.0.1:5173/'],
    ['about', 'http://127.0.0.1:5173/about'],
    ['module', 'http://127.0.0.1:5173/module/m1'],
    ['assessment', 'http://127.0.0.1:5173/assessment/pre-test'],
    ['scale', 'http://127.0.0.1:5173/assessment/pre-scale'],
  ];

  for (const [name, url] of shots) {
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    await page.screenshot({ path: `C:/tmp/phase04-${name}.png`, fullPage: false });
  }

  await browser.close();
})();
