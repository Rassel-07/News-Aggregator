/**
 * Article Normalizer and Text Sanitizer
 */

/**
 * Remove HTML tags, excess whitespace, and decode common XML/HTML entities
 */
function cleanText(input) {
  if (!input || typeof input !== 'string') return '';
  
  let text = input
    .replace(/<[^>]*>/g, ' ') // Strip HTML tags
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\s+/g, ' ')
    .trim();

  return text;
}

/**
 * Normalize title for near-duplicate and clustering detection
 */
function normalizeTitle(title) {
  if (!title) return '';

  let cleaned = cleanText(title).toLowerCase();

  // Strip trailing publisher branding (e.g. " - The Verge", " | BBC News")
  cleaned = cleaned.replace(/\s+[-|–—:]\s+[^-|–—:]+$/, '');

  // Remove common punctuation and normalize spaces
  cleaned = cleaned.replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();

  return cleaned;
}

/**
 * Extract tokens for Jaccard similarity
 */
function extractTokens(text) {
  const stopWords = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'if', 'because', 'as', 'what',
    'which', 'this', 'that', 'these', 'those', 'then', 'so', 'than', 'such',
    'both', 'through', 'about', 'for', 'is', 'of', 'while', 'during', 'to',
    'from', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further',
    'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all',
    'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such',
    'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very',
    's', 't', 'can', 'will', 'just', 'don', 'should', 'now', 'says', 'said',
    'new', 'after', 'with', 'by', 'at', 'into', 'first', 'update', 'breaking'
  ]);

  const words = normalizeTitle(text).split(' ');
  return words.filter(word => word.length > 2 && !stopWords.has(word));
}

/**
 * Compute Jaccard Similarity between two token arrays
 */
function computeSimilarity(tokensA, tokensB) {
  if (!tokensA.length || !tokensB.length) return 0;

  const setA = new Set(tokensA);
  const setB = new Set(tokensB);

  let intersectionSize = 0;
  for (const token of setA) {
    if (setB.has(token)) {
      intersectionSize++;
    }
  }

  const unionSize = new Set([...tokensA, ...tokensB]).size;
  return unionSize === 0 ? 0 : intersectionSize / unionSize;
}

/**
 * Estimate reading time in minutes based on word count
 */
function estimateReadingTime(text) {
  if (!text) return 2;
  const words = cleanText(text).split(/\s+/).length;
  return Math.min(Math.max(Math.ceil(words / 40), 1), 8);
}

module.exports = {
  cleanText,
  normalizeTitle,
  extractTokens,
  computeSimilarity,
  estimateReadingTime
};
