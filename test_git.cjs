async function test() {
  try {
    const res = await fetch('https://api.github.com/users/octocat/repos');
    const data = await res.json();
    console.log(data[0]);
  } catch(e) { console.error(e); }
}
test();
