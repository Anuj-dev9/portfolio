import https from 'https';
import fs from 'fs';

https.get('https://www.behance.net/anujadhikary193', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    // Behance stores project data in a JSON object inside the HTML
    const match = data.match(/\"projects\":(\[.*?\]),\"/);
    if (match) {
      const projects = JSON.parse(match[1]);
      const results = projects.map(p => ({
        title: p.name,
        category: p.fields[0] || 'Design',
        img: p.covers['404'],
        behance: p.url,
        tags: p.fields
      }));
      fs.writeFileSync('C:/Users/Administrator/Desktop/vs code/portfolio/portfolio/scratch/projects.json', JSON.stringify(results, null, 2));
      console.log('SUCCESS');
    } else {
      console.log('NOT FOUND');
    }
  });
}).on('error', (err) => { console.error(err); });
