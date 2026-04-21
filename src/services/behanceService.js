/**
 * Behance Service
 * Dynamically fetches and parses the Behance profile to get real project data.
 */

const BEHANCE_USER = 'anujadhikary193';
const PROXY_URL = 'https://api.codetabs.com/v1/proxy/?quest=';

// In-memory cache ensures projects are only fetched once per browser session
let cachedProjects = null;

export const fetchBehanceProjects = async () => {
  // If we already successfully fetched the projects this session, return them instantly
  if (cachedProjects) {
    return cachedProjects;
  }

  try {
    // Fetch up to 3 pages (36 projects) concurrently to cover the user's full portfolio
    const offsets = [0, 12, 24];
    const fetchPromises = offsets.map(offset => {
      let targetUrl = `https://www.behance.net/${BEHANCE_USER}`;
      if (offset > 0) {
        // Behance pagination uses base64 encoded offset exactly like '?after=MTI='
        targetUrl += `?after=${btoa(offset.toString())}`;
      }
      return fetch(`${PROXY_URL}${encodeURIComponent(targetUrl)}`)
        .then(res => res.ok ? res.text() : '')
        .catch(() => '');
    });

    const htmlPages = await Promise.all(fetchPromises);
    
    let allProjects = [];
    htmlPages.forEach(html => {
      if (html) {
        const parsed = parseHtmlFallback(html);
        if (parsed) allProjects = [...allProjects, ...parsed];
      }
    });

    // Filter duplicates just in case pagination overlaps
    const uniqueProjects = Array.from(new Map(allProjects.map(p => [p.title, p])).values());

    cachedProjects = uniqueProjects.length > 0 ? uniqueProjects : null;
    return cachedProjects;
  } catch (error) {
    console.error('Behance Sync Error:', error);
    return null;
  }
};

/**
 * Parses the Behance HTML to extract project covers stably
 */
const parseHtmlFallback = (html) => {
  const projects = [];
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    const covers = doc.querySelectorAll('.js-project-cover');
    
    covers.forEach((cover, index) => {
      const linkEl = cover.querySelector('a');
      const href = linkEl ? linkEl.getAttribute('href') : '';
      let title = linkEl ? (linkEl.getAttribute('title') || '') : '';
      if (title.startsWith('Link to project - ')) {
        title = title.replace('Link to project - ', '');
      }
      
      const imgEl = cover.querySelector('img');
      const sourceEl = cover.querySelector('source');
      
      let img = '';
      if (sourceEl && sourceEl.getAttribute('srcset')) {
          const srcset = sourceEl.getAttribute('srcset');
          img = srcset.split(' ')[0];
      } else if (imgEl && imgEl.getAttribute('src')) {
          img = imgEl.getAttribute('src');
      }
      
      if (title && href && img) {
         let section = 'Design2D';
         let displayTitle = title;
         
         const lowerTitle = title.toLowerCase();
         // Check for explicit routing tags in the title
         if (lowerTitle.includes('#design')) {
             section = 'Design2D';
             displayTitle = title.replace(/#design/gi, '').trim();
         } else if (lowerTitle.includes('#drawing') || lowerTitle.includes('painting')) {
             section = 'Gallery';
             displayTitle = title.replace(/#drawing/gi, '').trim();
         } else {
             // Fallback for existing legacy titles
             const galleryTitles = [
               'Whispers of Autumn Magic',
               'Lost in the Music',
               'Soft Confidence',
               'Radha Krishna'
             ];
             if (galleryTitles.some(t => title.toUpperCase().includes(t.toUpperCase()))) {
                 section = 'Gallery';
             }
         }

         projects.push({
           id: Math.random().toString(36).substr(2, 9),
           title: displayTitle,
           category: 'Creative Work', // Generic enough for Design2D and Gallery
           img: img,
           behance: href.startsWith('http') ? href : `https://www.behance.net${href}`,
           medium: 'Creative Work',
           year: new Date().getFullYear().toString(),
           tags: ['Behance'],
           portfolioSection: section
         });
      }
    });
  } catch (err) {
    console.error('DOM Parser error', err);
  }
  
  return projects.length > 0 ? projects : null;
};
