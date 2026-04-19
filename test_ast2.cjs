const jsdom = require("jsdom");
const { JSDOM } = jsdom;

async function test() {
  const PROXY_URL = 'https://api.codetabs.com/v1/proxy/?quest=';
  const ARTSTATION_USER = 'anuj_adhikary';
  const targetUrl = `https://www.artstation.com/${ARTSTATION_USER}.rss`;
  const response = await fetch(`${PROXY_URL}${encodeURIComponent(targetUrl)}`);
  const xmlText = await response.text();
  
  const dom = new JSDOM(xmlText, { contentType: "text/xml" });
  const xmlDoc = dom.window.document;
  
  const items = xmlDoc.querySelectorAll('item');
  console.log("Items found:", items.length);
  
  items.forEach((item, index) => {
      const title = item.querySelector('title')?.textContent || '3D Project';
      
      const itemRawText = item.innerHTML || item.textContent || '';
      
      let img = '';
      const imgMatch = itemRawText.match(/<img[^>]+src=["']([^"']+)["']/i);
      if (imgMatch && imgMatch[1]) {
        img = imgMatch[1];
      }
      
      console.log(`[${index}] -> title=${title}, img=${img}`);
  });
}

test();
