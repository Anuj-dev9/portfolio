async function test() {
  const PROXY_URL = 'https://api.codetabs.com/v1/proxy/?quest=';
  const BEHANCE_USER = 'anujadhikary193';
  const url = encodeURIComponent(`https://www.behance.net/${BEHANCE_USER}`);
  const response = await fetch(`${PROXY_URL}${url}`);
  const html = await response.text();
  
  // Try to find script tags with json
  const matches = html.match(/<script[^>]*type="application\/json"[^>]*>(.*?)<\/script>/gs);
  if (matches) {
     console.log(`Found ${matches.length} application/json scripts`);
     for (let m of matches) {
         if (m.length > 500) {
             console.log(m.substring(0, 100) + '...' + m.substring(m.length - 100));
         }
     }
  } else {
     console.log('No application/json scripts found');
  }
}
test();
