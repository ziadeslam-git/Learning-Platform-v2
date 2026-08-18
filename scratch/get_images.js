const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://docs.google.com/forms/d/e/1FAIpQLSdBngsBRSbz3ji3vDI6_Rt_e5b75uyR8fn7dIIiGxbPYCEhkg/viewform?pli=1', { waitUntil: 'networkidle2' });
  
  const images = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('img')).map(img => img.src);
  });
  
  console.log(JSON.stringify(images, null, 2));
  
  await browser.close();
})();
