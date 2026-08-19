const {
  cleanText,
  normalizeTitle,
  extractTokens,
  computeSimilarity,
  estimateReadingTime
} = require('../services/normalizer');

describe('News Normalizer & Similarity Service', () => {
  test('cleanText should strip HTML tags and entities', () => {
    const raw = '<p>Breaking: <strong>Apple</strong> announces new M4 chip &amp; iPads &nbsp;</p>';
    const cleaned = cleanText(raw);
    expect(cleaned).toBe('Breaking: Apple announces new M4 chip & iPads');
  });

  test('normalizeTitle should remove publisher branding suffixes and punctuation', () => {
    const raw = 'OpenAI launches next-gen reasoning model - The Verge';
    const normalized = normalizeTitle(raw);
    expect(normalized).toBe('openai launches next gen reasoning model');
  });

  test('extractTokens should remove common stop words and short tokens', () => {
    const title = 'A new breakthrough in artificial intelligence for healthcare';
    const tokens = extractTokens(title);
    expect(tokens).toContain('breakthrough');
    expect(tokens).toContain('artificial');
    expect(tokens).toContain('intelligence');
    expect(tokens).toContain('healthcare');
    expect(tokens).not.toContain('in');
    expect(tokens).not.toContain('for');
  });

  test('computeSimilarity should calculate Jaccard index accurately', () => {
    const tokensA = ['apple', 'announces', 'artificial', 'intelligence', 'features'];
    const tokensB = ['apple', 'reveals', 'artificial', 'intelligence', 'features'];
    const score = computeSimilarity(tokensA, tokensB);

    // Intersection: apple, artificial, intelligence, features (4)
    // Union: apple, announces, reveals, artificial, intelligence, features (6)
    // Score: 4/6 = 0.666...
    expect(score).toBeGreaterThanOrEqual(0.65);
  });

  test('estimateReadingTime should calculate sensible minute estimates', () => {
    const shortText = 'Short summary of fifty words or so.';
    expect(estimateReadingTime(shortText)).toBeGreaterThanOrEqual(1);

    const longText = new Array(500).fill('technology innovation future discovery').join(' ');
    expect(estimateReadingTime(longText)).toBeGreaterThan(2);
  });
});
