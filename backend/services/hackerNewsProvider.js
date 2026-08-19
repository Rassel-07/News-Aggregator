/**
 * Hacker News Free Public API Provider
 * 
 * Ingests top tech, startup, and AI stories with original canonical links.
 */

const axios = require('axios');
const { normalizeTitle, estimateReadingTime } = require('./normalizer');

async function fetchHackerNewsArticles(limit = 15) {
  try {
    const topIdsRes = await axios.get('https://hacker-news.firebaseio.com/v0/topstories.json', { timeout: 6000 });
    const storyIds = (topIdsRes.data || []).slice(0, limit);

    const storyPromises = storyIds.map(id =>
      axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, { timeout: 5000 }).catch(() => null)
    );

    const storyResponses = await Promise.all(storyPromises);
    const articles = [];

    for (const res of storyResponses) {
      if (!res || !res.data) continue;
      const item = res.data;
      if (!item.title || !item.url) continue;

      let domain = 'news.ycombinator.com';
      try {
        domain = new URL(item.url).hostname.replace('www.', '');
      } catch (e) {}

      let category = 'Technology';
      const lower = item.title.toLowerCase();
      if (lower.includes('ai') || lower.includes('gpt') || lower.includes('llm') || lower.includes('model') || lower.includes('neural')) {
        category = 'AI';
      } else if (lower.includes('startup') || lower.includes('founder') || lower.includes('raised') || lower.includes('funding')) {
        category = 'Startups';
      } else if (lower.includes('science') || lower.includes('physics') || lower.includes('biology') || lower.includes('space')) {
        category = 'Science';
      }

      articles.push({
        title: item.title,
        normalizedTitle: normalizeTitle(item.title),
        description: `Trending discussion on Hacker News with ${item.score || 0} points and ${item.descendants || 0} comments.`,
        canonicalUrl: item.url,
        sourceUrl: item.url,
        sourceName: domain.charAt(0).toUpperCase() + domain.slice(1),
        sourceDomain: domain,
        sourceLogo: `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
        imageUrl: '', // No fake stock photo; shows elegant editorial typographic card
        author: item.by || 'HN',
        category,
        country: 'US',
        language: 'en',
        provider: 'HackerNewsAPI',
        externalId: `hn-${item.id}`,
        readingTimeMinutes: 3,
        publishedAt: new Date(item.time * 1000)
      });
    }

    return articles;
  } catch (error) {
    console.warn('[HackerNewsProvider] Warning: Failed to fetch Hacker News feed:', error.message);
    return [];
  }
}

module.exports = {
  fetchHackerNewsArticles
};
