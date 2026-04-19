const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

async function test() {
  const PROXY_URL = 'https://api.codetabs.com/v1/proxy/?quest=';
  const BEHANCE_USER = 'anujadhikary193';
  const url = encodeURIComponent(`https://www.behance.net/${BEHANCE_USER}`);
  const response = await fetch(`${PROXY_URL}${url}`);
  const html = await response.text();
  
  const dom = new JSDOM(html);
  const doc = dom.window.document;
  
  const covers = doc.querySelectorAll('.js-project-cover');
  console.log("Covers found:", covers.length);
  
  covers.forEach((cover, index) => {
      const linkEl = cover.querySelector('a');
      const href = linkEl ? linkEl.getAttribute('href') : '';
      let title = linkEl ? (linkEl.getAttribute('title') || '') : '';
      if (title.startsWith('Link to project - ')) {
        title = title.replace('Link to project - ', '');
      }
      
      const imgEl = cover.querySelector('img');
      const sourceEl = cover.querySelector('source');
      
      let img = '';
      if (sourceEl && sourceEl.getAttribute('srcset')) {
          const srcset = sourceEl.getAttribute('srcset');
          img = srcset.split(' ')[0];
      } else if (imgEl && imgEl.getAttribute('src')) {
          img = imgEl.getAttribute('src');
      }
      
      console.log(`[${index}] -> title=${title}, href=${href}, img=${img}`);
  });
}

test();
