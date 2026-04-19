async function test() {
  const rssUrl = 'https://rsshub.app/behance/portfolio/anujadhikary193';
  const response = await fetch(rssUrl);
  const data = await response.text();
  console.log(data.substring(0, 500));
}
test();
