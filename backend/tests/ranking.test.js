const { calculateArticleScore, rankAndDiversify } = require('../services/rankingService');

describe('News Ranking & Source Diversity Engine', () => {
  test('Fresh articles should score higher than old articles when all else is equal', () => {
    const now = Date.now();
    const freshArticle = {
      title: 'Fresh breaking tech story',
      category: 'Technology',
      country: 'US',
      publishedAt: new Date(now - 30 * 60 * 1000) // 30 mins ago
    };
    const olderArticle = {
      title: 'Older tech story',
      category: 'Technology',
      country: 'US',
      publishedAt: new Date(now - 48 * 60 * 60 * 1000) // 48 hours ago
    };

    const freshScore = calculateArticleScore(freshArticle, {});
    const olderScore = calculateArticleScore(olderArticle, {});

    expect(freshScore).toBeGreaterThan(olderScore);
  });

  test('Articles in user preferred category should receive a score boost', () => {
    const now = Date.now();
    const articleAI = {
      title: 'AI breakthrough',
      category: 'AI',
      country: 'US',
      publishedAt: new Date(now - 60 * 60 * 1000)
    };
    const articleSports = {
      title: 'Sports update',
      category: 'Sports',
      country: 'US',
      publishedAt: new Date(now - 60 * 60 * 1000)
    };

    const userPreferences = { categories: ['AI', 'Technology'] };

    const aiScore = calculateArticleScore(articleAI, userPreferences);
    const sportsScore = calculateArticleScore(articleSports, userPreferences);

    expect(aiScore).toBeGreaterThan(sportsScore);
  });

  test('rankAndDiversify should prevent the same source from dominating top slots', () => {
    const now = Date.now();
    const articles = [
      { title: 'Story 1', sourceName: 'The Verge', category: 'Technology', publishedAt: new Date(now - 5 * 60 * 1000) },
      { title: 'Story 2', sourceName: 'The Verge', category: 'Technology', publishedAt: new Date(now - 10 * 60 * 1000) },
      { title: 'Story 3', sourceName: 'The Verge', category: 'Technology', publishedAt: new Date(now - 15 * 60 * 1000) },
      { title: 'Story 4', sourceName: 'BBC News', category: 'World', publishedAt: new Date(now - 20 * 60 * 1000) },
      { title: 'Story 5', sourceName: 'Reuters', category: 'Business', publishedAt: new Date(now - 25 * 60 * 1000) }
    ];

    const ranked = rankAndDiversify(articles, {});

    // First 3 items should not all be from 'The Verge'
    const top3Sources = ranked.slice(0, 3).map(a => a.sourceName);
    const vergeCount = top3Sources.filter(s => s === 'The Verge').length;
    expect(vergeCount).toBeLessThanOrEqual(2);
  });
});
