/**
 * RSS and Atom Feed Ingestion Provider
 * 
 * Safely fetches public feeds, handles timeouts, extracts media metadata,
 * sanitizes text, and transforms items into standardized Article candidate objects.
 * Shows ONLY genuine story-specific images that are part of the news article.
 */

const Parser = require('rss-parser');
const { cleanText, normalizeTitle, estimateReadingTime } = require('./normalizer');

const parser = new Parser({
  timeout: 15000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept': 'application/rss+xml, application/atom+xml, application/xml, text/xml, */*'
  },
  customFields: {
    item: [
      ['media:content', 'mediaContent', { keepArray: true }],
      ['media:thumbnail', 'mediaThumbnail', { keepArray: true }],
      ['media:group', 'mediaGroup'],
      ['enclosure', 'enclosure'],
      ['content:encoded', 'contentEncoded'],
      ['dc:creator', 'creator'],
      ['source', 'source']
    ]
  }
});

/**
 * Extract genuine story image from RSS item metadata
 * Returns empty string if no image was provided by the publisher
 */
function extractImageUrl(item) {
  if (!item) return '';

  // 1. Check enclosure
  if (item.enclosure && item.enclosure.url) {
    const url = item.enclosure.url;
    if ((item.enclosure.type || '').startsWith('image/') || url.match(/\.(jpeg|jpg|png|webp|avif)/i)) {
      return url;
    }
  }

  // 2. Check media:content
  if (Array.isArray(item.mediaContent) && item.mediaContent.length > 0) {
    for (const media of item.mediaContent) {
      if (media && media.$ && media.$.url) {
        return media.$.url;
      }
      if (media && typeof media.url === 'string') {
        return media.url;
      }
    }
  } else if (item.mediaContent) {
    if (item.mediaContent.$ && item.mediaContent.$.url) return item.mediaContent.$.url;
    if (typeof item.mediaContent.url === 'string') return item.mediaContent.url;
  }

  // 3. Check media:thumbnail
  if (Array.isArray(item.mediaThumbnail) && item.mediaThumbnail.length > 0) {
    for (const thumb of item.mediaThumbnail) {
      if (thumb && thumb.$ && thumb.$.url) {
        return thumb.$.url;
      }
      if (thumb && typeof thumb.url === 'string') {
        return thumb.url;
      }
    }
  } else if (item.mediaThumbnail) {
    if (item.mediaThumbnail.$ && item.mediaThumbnail.$.url) return item.mediaThumbnail.$.url;
    if (typeof item.mediaThumbnail.url === 'string') return item.mediaThumbnail.url;
  }

  // 4. Check media:group
  if (item.mediaGroup) {
    const mg = item.mediaGroup;
    if (mg['media:content'] && mg['media:content'].$ && mg['media:content'].$.url) {
      return mg['media:content'].$.url;
    }
    if (mg['media:thumbnail'] && mg['media:thumbnail'].$ && mg['media:thumbnail'].$.url) {
      return mg['media:thumbnail'].$.url;
    }
  }

  // 5. Check direct item.image
  if (item.image && typeof item.image === 'string' && item.image.startsWith('http')) {
    return item.image;
  }
  if (item.image && item.image.url && typeof item.image.url === 'string') {
    return item.image.url;
  }

  // 6. Try extracting <img> tag from contentEncoded, content, or description
  const rawHtml = item.contentEncoded || item.content || item.summary || item.description || '';
  const imgMatch = rawHtml.match(/<img[^>]+src=["'](https?:\/\/[^"'>]+)["']/i);
  if (imgMatch && imgMatch[1]) {
    const url = imgMatch[1];
    // Filter tracking pixels or feedburner icons
    if (!url.includes('1x1') && !url.includes('pixel') && !url.includes('feedburner') && !url.includes('stat.') && !url.includes('beacon')) {
      return url;
    }
  }

  // Return empty string if no authentic image exists for this story
  return '';
}

/**
 * Fetch and parse a single RSS source (up to 50 items per feed for max volume)
 */
async function fetchSourceArticles(source) {
  try {
    const feed = await parser.parseURL(source.feedUrl);
    if (!feed || !Array.isArray(feed.items)) {
      return [];
    }

    const articles = [];
    const sourceDomain = source.domain || (new URL(source.feedUrl)).hostname;
    const sourceLogo = `https://www.google.com/s2/favicons?domain=${sourceDomain}&sz=128`;

    // Take up to 50 items per feed for maximum content volume
    const items = feed.items.slice(0, 50);

    for (const item of items) {
      const title = cleanText(item.title);
      if (!title || title.length < 5) continue;

      const rawLink = item.link || item.guid || '';
      if (!rawLink || !rawLink.startsWith('http')) continue;

      // Extract canonical URL (strip tracking params like utm_*)
      let canonicalUrl = rawLink;
      try {
        const parsedUrl = new URL(rawLink);
        parsedUrl.searchParams.delete('utm_source');
        parsedUrl.searchParams.delete('utm_medium');
        parsedUrl.searchParams.delete('utm_campaign');
        parsedUrl.searchParams.delete('utm_term');
        parsedUrl.searchParams.delete('utm_content');
        canonicalUrl = parsedUrl.toString();
      } catch (e) {
        canonicalUrl = rawLink;
      }

      // Clean description
      const rawDesc = item.contentSnippet || item.summary || item.description || '';
      const description = cleanText(rawDesc).slice(0, 400);

      // Extract ONLY genuine story photo
      const imageUrl = extractImageUrl(item);

      // Published date
      let publishedAt = new Date();
      if (item.isoDate) {
        publishedAt = new Date(item.isoDate);
      } else if (item.pubDate) {
        publishedAt = new Date(item.pubDate);
      }
      if (isNaN(publishedAt.getTime())) {
        publishedAt = new Date();
      }

      // For Google News feeds the real publisher name is in item.source._
      let displaySourceName = source.name;
      if (item.source && item.source._ && item.source._.length > 1) {
        displaySourceName = item.source._;
      }

      const readingTimeMinutes = estimateReadingTime(description || title);

      articles.push({
        title,
        normalizedTitle: normalizeTitle(title),
        description,
        canonicalUrl,
        sourceUrl: rawLink,
        sourceName: displaySourceName,
        sourceDomain,
        sourceLogo,
        imageUrl,
        author: cleanText(item.creator || item.author || displaySourceName),
        category: source.category,
        country: source.country || 'US',
        language: source.language || 'en',
        provider: 'RSS',
        externalId: item.guid || canonicalUrl,
        readingTimeMinutes,
        publishedAt
      });
    }

    return articles;
  } catch (error) {
    console.warn(`[RSSProvider] Notice: Feed "${source.name}" (${source.feedUrl}): ${error.message}`);
    return [];
  }
}

module.exports = {
  fetchSourceArticles,
  extractImageUrl
};
