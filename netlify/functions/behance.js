export const handler = async (event) => {
  const BEHANCE_USER = 'anujadhikary193';
  const { after } = event.queryStringParameters || {};
  
  let targetUrl = `https://www.behance.net/${BEHANCE_USER}`;
  if (after) {
    targetUrl += `?after=${after}`;
  }

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      }
    });

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: `Failed to fetch from Behance: ${response.statusText}`
      };
    }

    const html = await response.text();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html',
        'Access-Control-Allow-Origin': '*'
      },
      body: html
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch Behance profile', details: error.message })
    };
  }
};
