/**
 * ArtStation Service
 * Dynamically fetches and parses the ArtStation RSS feed natively.
 * Uses localStorage caching + timeout for fast repeat loads.
 */

const ARTSTATION_USER = 'anuj_adhikary';

// Multiple proxy options — fallback if primary is slow
const PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://api.codetabs.com/v1/proxy/?quest=',
];

const CACHE_KEY = 'artstation_projects_cache';
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour
const FETCH_TIMEOUT = 8000; // 8 second timeout

// In-memory cache for current session
let cachedProjects = null;

/**
 * Fetch with a timeout to prevent hanging
 */
function fetchWithTimeout(url, timeout) {
  return Promise.race([
    fetch(url),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timed out')), timeout)
    ),
  ]);
}

/**
 * Try to load from localStorage cache first
 */
function loadFromLocalStorage() {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_DURATION && data && data.length > 0) {
      return data;
    }
  } catch {
    // localStorage unavailable or corrupted — ignore
  }
  return null;
}

/**
 * Save to localStorage for fast repeat loads
 */
function saveToLocalStorage(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data,
      timestamp: Date.now(),
    }));
  } catch {
    // quota exceeded or unavailable — ignore
  }
}

export const fetchArtstationProjects = async () => {
  // 1. Return in-memory cache immediately
  if (cachedProjects) {
    return cachedProjects;
  }

  // 2. Try localStorage cache (instant on repeat visits)
  const localCached = loadFromLocalStorage();
  if (localCached) {
    cachedProjects = localCached;
    return cachedProjects;
  }

  // 3. Fetch fresh from network with timeout + proxy fallbacks
  const targetUrl = `https://www.artstation.com/${ARTSTATION_USER}.rss`;

  for (const proxy of PROXIES) {
    try {
      const response = await fetchWithTimeout(
        `${proxy}${encodeURIComponent(targetUrl)}`,
        FETCH_TIMEOUT
      );

      if (!response.ok) continue;

      const xmlText = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

      // Check for parsing errors
      const errorNode = xmlDoc.querySelector('parsererror');
      if (errorNode) continue;

      const items = xmlDoc.getElementsByTagName('item');
      console.log(`ArtStation Feed: Found ${items.length} items`);
      const projects = [];

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const title = item.getElementsByTagName('title')[0]?.textContent || '3D Project';
        const link = item.getElementsByTagName('link')[0]?.textContent || '#';

        const serializer = new XMLSerializer();
        const itemRawText = serializer.serializeToString(item);

        // Attempt to find image in content:encoded or description
        let img = '';
        const imgMatch = itemRawText.match(/<img[^>]+src=["']([^"']+)["']/i);
        if (imgMatch && imgMatch[1]) {
          img = imgMatch[1];
        }

        const accents = ['#E8A838', '#C06848', '#7B9E87', '#5B8FB9', '#D4A574'];
        const accent = accents[i % accents.length];

        projects.push({
          id: `ast-${i}`,
          title: title,
          desc: '3D modeling showcase designed and sculpted natively. Rendered explicitly for ArtStation pipeline integration.',
          img: img,
          tags: ['3D Modeling', 'ArtStation'],
          category: '3D Art',
          polys: 'Optimized',
          render: 'Standard',
          time: 'HD',
          accent: accent,
          behance: null,
          artstation: link,
        });
      }

      if (projects.length > 0) {
        cachedProjects = projects;
        saveToLocalStorage(projects);
        return cachedProjects;
      }
    } catch (error) {
      console.warn(`ArtStation proxy failed (${proxy}):`, error.message);
      continue; // Try next proxy
    }
  }

  console.error('All ArtStation proxies failed');
  return [];
};
