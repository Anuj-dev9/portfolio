async function search() {
  try {
    const res = await fetch('https://api.github.com/users/texastiger200');
    const data = await res.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}
search();
