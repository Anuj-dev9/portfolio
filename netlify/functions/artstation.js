export const handler = async (event) => {
  const ARTSTATION_USER = 'anuj_adhikary';
  const targetUrl = `https://www.artstation.com/${ARTSTATION_USER}.rss`;

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'application/rss+xml,application/xml;q=0.9,*/*;q=0.8',
      }
    });

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: `Failed to fetch from ArtStation: ${response.statusText}`
      };
    }

    const xml = await response.text();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/rss+xml',
        'Access-Control-Allow-Origin': '*'
      },
      body: xml
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch ArtStation profile', details: error.message })
    };
  }
};
