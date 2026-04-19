async function test() {
  const PROXY_URL = 'https://api.codetabs.com/v1/proxy/?quest=';
  const BEHANCE_USER = 'anujadhikary193';
  const url = encodeURIComponent(`https://www.behance.net/${BEHANCE_USER}`);
  const response = await fetch(`${PROXY_URL}${url}`);
  const html = await response.text();
  
  const startIndex = html.indexOf('PURE CONTRAST');
  if (startIndex !== -1) {
    console.log(html.substring(startIndex - 500, startIndex + 1000));
  } else {
    console.log('Not found');
  }
}
test();
