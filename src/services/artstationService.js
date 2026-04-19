/**
 * ArtStation Service
 * Dynamically fetches and parses the ArtStation RSS feed natively.
 */

const ARTSTATION_USER = 'anuj_adhikary';
const PROXY_URL = 'https://api.codetabs.com/v1/proxy/?quest=';

// In-memory cache ensures projects are only fetched once per browser session
let cachedProjects = null;

export const fetchArtstationProjects = async () => {
  if (cachedProjects) {
    return cachedProjects;
  }

  try {
    const targetUrl = `https://www.artstation.com/${ARTSTATION_USER}.rss`;
    const response = await fetch(`${PROXY_URL}${encodeURIComponent(targetUrl)}`);
    
    if (!response.ok) {
      console.error('Failed to fetch ArtStation RSS');
      return [];
    }

    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    
    const items = xmlDoc.querySelectorAll('item');
    const projects = [];

    items.forEach((item, index) => {
      const title = item.querySelector('title')?.textContent || '3D Project';
      const link = item.querySelector('link')?.textContent || '#';
      
      // ArtStation embeds the <img> tag inside `<content:encoded>` CDATA block instead of <description>
      // Chrome's DOMParser strips HTML tags from textContent, so we must serialize the raw XML node precisely natively
      const serializer = new XMLSerializer();
      const itemRawText = serializer.serializeToString(item);
      
      // Extract image URL from CDATA standard HTML snippet
      let img = '';
      const imgMatch = itemRawText.match(/<img[^>]+src=["']([^"']+)["']/i);
      if (imgMatch && imgMatch[1]) {
        img = imgMatch[1];
      }

      // Generate visual themes based on generic index mapping or title parsing
      const accents = ['#a855f7', '#06b6d4', '#ec4899', '#10b981', '#f59e0b'];
      const accent = accents[index % accents.length];

      projects.push({
        id: `ast-${index}`,
        title: title,
        desc: '3D modeling showcase designed and sculpted natively. Rendered explicitly for ArtStation pipeline integration.',
        img: img,
        tags: ['3D Modeling', 'ArtStation'],
        category: '3D Art',
        polys: 'Optimized',
        render: 'Standard',
        time: 'HD',
        accent: accent,
        behance: null, // Keep null to suppress behance
        artstation: link,
      });
    });

    cachedProjects = projects;
    return cachedProjects;
  } catch (error) {
    console.error('ArtStation Sync Error:', error);
    return [];
  }
};
