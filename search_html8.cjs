async function test() {
  const PROXY_URL = 'https://api.codetabs.com/v1/proxy/?quest=';
  const BEHANCE_USER = 'anujadhikary193';
  const url = encodeURIComponent(`https://www.behance.net/${BEHANCE_USER}`);
  const response = await fetch(`${PROXY_URL}${url}`);
  const html = await response.text();
  
  const m = html.match(/<script type="application\/json" id="beconfig-store_state">(.*?)<\/script>/s);
  if (m) {
     const stateData = m[1];
     try {
       const state = JSON.parse(stateData);
       // Function to recursively find arrays that contain an object with specific project keys
       function search(obj, path = '') {
         if (Array.isArray(obj)) {
           if (obj.length > 0 && obj[0] && typeof obj[0] === 'object' && obj[0].hasOwnProperty('name') && obj[0].hasOwnProperty('covers')) {
             console.log(`Found projects array at: ${path} (length: ${obj.length})`);
             return obj;
           }
         } else if (obj && typeof obj === 'object') {
           for (let key in obj) {
             const res = search(obj[key], path ? `${path}.${key}` : key);
             if (res) return res;
           }
         }
       }
       
       search(state);
     } catch (err) {
       console.log('Parsing error');
     }
  }
}
test();
