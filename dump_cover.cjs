async function test() {
  const PROXY_URL = 'https://api.codetabs.com/v1/proxy/?quest=';
  const BEHANCE_USER = 'anujadhikary193';
  const targetUrl = `https://www.behance.net/${BEHANCE_USER}`;
  const res = await fetch(`${PROXY_URL}${encodeURIComponent(targetUrl)}`);
  const html = await res.text();
  const { JSDOM } = require("jsdom");
  const doc = new JSDOM(html).window.document;
  const covers = doc.querySelectorAll('.js-project-cover');
  if (covers.length > 0) {
      console.log(covers[0].innerHTML);
  }
}
test();
