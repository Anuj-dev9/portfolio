async function test() {
  const PROXY_URL = 'https://api.codetabs.com/v1/proxy/?quest=';
  const BEHANCE_USER = 'anujadhikary193';
  const offsets = [0, 12, 24];
  const fetchPromises = offsets.map(offset => {
    let targetUrl = `https://www.behance.net/${BEHANCE_USER}`;
    if (offset > 0) targetUrl += `?after=${btoa(offset.toString())}`;
    return fetch(`${PROXY_URL}${encodeURIComponent(targetUrl)}`)
      .then(res => res.ok ? res.text() : '')
      .catch(() => '');
  });

  const htmlPages = await Promise.all(fetchPromises);
  const { JSDOM } = require("jsdom");
  
  let allProjects = [];
  htmlPages.forEach(html => {
    if (html) {
      const dom = new JSDOM(html);
      const doc = dom.window.document;
      const covers = doc.querySelectorAll('.js-project-cover');
      covers.forEach(cover => {
        const linkEl = cover.querySelector('a');
        let title = linkEl ? (linkEl.getAttribute('title') || '') : '';
        if (title.startsWith('Link to project - ')) title = title.replace('Link to project - ', '');
        if (title) allProjects.push(title);
      });
    }
  });

  const unique = Array.from(new Set(allProjects));
  console.log("Found", unique.length, "projects:");
  unique.forEach((t, i) => console.log(`${i+1}. ${t}`));
}
test();
