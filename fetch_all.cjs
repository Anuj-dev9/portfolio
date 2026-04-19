async function test() {
  const PROXY_URL = 'https://api.codetabs.com/v1/proxy/?quest=';
  const BEHANCE_USER = 'anujadhikary193';
  
  // page 2
  const urlPage2 = encodeURIComponent(`https://www.behance.net/${BEHANCE_USER}?after=MTI=`);
  let res = await fetch(`${PROXY_URL}${urlPage2}`);
  let html = await res.text();
  
  // count how many covers are on this page via regex
  let matches = html.match(/class="[^"]*js-project-cover/g);
  console.log(`Page 2 has ${matches ? matches.length : 0} covers`);
  
  // page 3? after=MjQ=
  const urlPage3 = encodeURIComponent(`https://www.behance.net/${BEHANCE_USER}?after=MjQ=`);
  res = await fetch(`${PROXY_URL}${urlPage3}`);
  html = await res.text();
  matches = html.match(/class="[^"]*js-project-cover/g);
  console.log(`Page 3 has ${matches ? matches.length : 0} covers`);
}
test();
