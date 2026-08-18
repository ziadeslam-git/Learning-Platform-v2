const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSdBngsBRSbz3ji3vDI6_Rt_e5b75uyR8fn7dIIiGxbPYCEhkg/viewform?pli=1';
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'assets', 'exam');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const imageUrls = [];

  page.on('response', async (response) => {
    const url = response.url();
    const contentType = response.headers()['content-type'] || '';
    if ((contentType.includes('image/') || contentType.includes('image/jpeg') || contentType.includes('image/png'))
        && (url.includes('googleusercontent') || url.includes('gstatic') || url.includes('ggpht') || url.includes('docs.google'))) {
      imageUrls.push({ url, contentType });
    }
  });

  console.log('Loading form...');
  await page.goto(FORM_URL, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(5000);

  // Get all img elements
  const imgElements = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('img')).map(img => ({
      src: img.src,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      alt: img.alt
    })).filter(img => img.src && img.src.startsWith('http'));
  });

  console.log(`Found ${imgElements.length} img elements`);
  console.log(`Intercepted ${imageUrls.length} image responses`);

  // Filter out tiny icons (less than 50px)
  const questionImages = imgElements.filter(img => img.naturalWidth > 50);
  console.log(`Question images (>50px): ${questionImages.length}`);
  
  // Write results
  const results = {
    imgElements,
    questionImages,
    interceptedUrls: imageUrls
  };

  fs.writeFileSync(path.join(__dirname, 'image_results.json'), JSON.stringify(results, null, 2));
  console.log('Saved image_results.json');
  
  // Try to download question images
  for (let i = 0; i < questionImages.length; i++) {
    const img = questionImages[i];
    console.log(`Downloading Q${i+1}: ${img.src.substring(0, 80)}...`);
    try {
      const buffer = await page.evaluate(async (url) => {
        const res = await fetch(url);
        const buf = await res.arrayBuffer();
        return Array.from(new Uint8Array(buf));
      }, img.src);
      const outPath = path.join(OUTPUT_DIR, `q${i+1}.png`);
      fs.writeFileSync(outPath, Buffer.from(buffer));
      console.log(`  Saved to ${outPath}`);
    } catch (e) {
      console.log(`  Error: ${e.message}`);
    }
  }

  await browser.close();
  console.log('Done!');
})();
