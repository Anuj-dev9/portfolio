async function test() {
  const PROXY_URL = 'https://api.codetabs.com/v1/proxy/?quest=';
  const BEHANCE_USER = 'anujadhikary193';
  const url = encodeURIComponent(`https://www.behance.net/${BEHANCE_USER}`);
  const response = await fetch(`${PROXY_URL}${url}`);
  const html = await response.text();
  
  const m = html.match(/<script type="application\/json" id="beconfig-store_state">(.*?)<\/script>/s);
  if (m) {
     const stateData = m[1];
     console.log('Size of state data:', stateData.length);
     try {
       const state = JSON.parse(stateData);
       // Check if profile exists
       if (state.profile) {
           console.log("Profile keys:", Object.keys(state.profile));
           if (state.profile.activeTab) {
               console.log("activeTab keys:", Object.keys(state.profile.activeTab));
               if (state.profile.activeTab.items) {
                   console.log(`Found ${state.profile.activeTab.items.length} items!`);
               }
           }
       } else {
           // Maybe it's flattened
           console.log("Top level keys:", Object.keys(state).join(', '));
       }
     } catch (err) {
       console.log('Parsing error');
     }
  }
}
test();
