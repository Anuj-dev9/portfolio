async function search() {
  try {
    const res = await fetch('https://api.github.com/users/Anuj-dev9/repos');
    const data = await res.json();
    console.log(data.map(repo => repo.name));
  } catch (error) {
    console.error(error);
  }
}
search();
