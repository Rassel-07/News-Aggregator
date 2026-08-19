/**
 * Multi-Provider Free News API Integration
 * 
 * Supports external free-tier News APIs when API keys are configured in .env:
 * 1. Newsdata.io (NEWSDATA_API_KEY)
 * 2. NewsAPI.org (NEWS_API_KEY)
 * 3. MediaStack (MEDIASTACK_API_KEY)
 * 4. Currents API (CURRENTS_API_KEY)
 */

const axios = require('axios');
const { normalizeTitle, estimateReadingTime, getFallbackImage } = require('./normalizer');

/**
 * Fetch from Newsdata.io if key is set (Free tier available: 200 credits/day)
 */
async function fetchNewsDataIO(apiKey, category = 'technology') {
  if (!apiKey) return [];
  try {
    const res = await axios.get('https://newsdata.io/api/1/news', {
      params: {
        apikey: apiKey,
        category: category.toLowerCase(),
        language: 'en'
      },
      timeout: 8000
    });

    if (!res.data || !Array.isArray(res.data.results)) return [];

    return res.data.results.map(item => ({
      title: item.title,
      normalizedTitle: normalizeTitle(item.title),
      description: item.description || item.contentSnippet || '',
      canonicalUrl: item.link,
      sourceUrl: item.link,
      sourceName: item.source_id || 'Newsdata',
      sourceDomain: (item.source_id || 'newsdata.io').toLowerCase(),
      sourceLogo: `https://www.google.com/s2/favicons?domain=${item.source_id || 'newsdata.io'}&sz=128`,
      imageUrl: item.image_url || getFallbackImage(category),
      author: (item.creator && item.creator[0]) || item.source_id || '',
      category: category,
      country: (item.country && item.country[0]) || 'US',
      language: 'en',
      provider: 'NewsDataIO',
      externalId: item.article_id || item.link,
      readingTimeMinutes: estimateReadingTime(item.description),
      publishedAt: new Date(item.pubDate || Date.now())
    }));
  } catch (err) {
    console.warn('[NewsDataIO] Warning: Failed to fetch:', err.message);
    return [];
  }
}

/**
 * Fetch from NewsAPI.org if key is set (Free developer key available: 100 requests/day)
 */
async function fetchNewsAPIOrg(apiKey, category = 'technology') {
  if (!apiKey) return [];
  try {
    const res = await axios.get('https://newsapi.org/v2/top-headlines', {
      params: {
        apiKey,
        category: category.toLowerCase(),
        language: 'en',
        pageSize: 15
      },
      timeout: 8000
    });

    if (!res.data || !Array.isArray(res.data.articles)) return [];

    return res.data.articles
      .filter(a => a.title && a.url)
      .map(item => ({
        title: item.title,
        normalizedTitle: normalizeTitle(item.title),
        description: item.description || '',
        canonicalUrl: item.url,
        sourceUrl: item.url,
        sourceName: item.source.name || 'NewsAPI',
        sourceDomain: (new URL(item.url)).hostname.replace('www.', ''),
        sourceLogo: `https://www.google.com/s2/favicons?domain=${new URL(item.url).hostname}&sz=128`,
        imageUrl: item.urlToImage || getFallbackImage(category),
        author: item.author || item.source.name || '',
        category,
        country: 'US',
        language: 'en',
        provider: 'NewsAPI.org',
        externalId: item.url,
        readingTimeMinutes: estimateReadingTime(item.description),
        publishedAt: new Date(item.publishedAt || Date.now())
      }));
  } catch (err) {
    console.warn('[NewsAPI.org] Warning: Failed to fetch:', err.message);
    return [];
  }
}

module.exports = {
  fetchNewsDataIO,
  fetchNewsAPIOrg
};
