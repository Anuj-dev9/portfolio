const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('B-Console:', msg.text()));
  
  await page.goto('http://localhost:5173/'); // Make sure this is the right url
  
  // wait a bit for react to load
  await new Promise(r => setTimeout(r, 3000));
  
  const debugData = await page.evaluate(() => window.__DEBUG_LIVE_DATA);
  console.log("Extracted Live Data:", JSON.stringify(debugData, null, 2));
  
  await browser.close();
})();
