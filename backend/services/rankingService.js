/**
 * News Ranking and Personalization Engine
 * 
 * Computes transparent, heuristic-based ranking scores combining:
 * 1. Freshness decay
 * 2. Category interest preferences
 * 3. Multi-source cluster significance
 * 4. Source diversity balancing
 */

/**
 * Score a single article for ranking
 */
function calculateArticleScore(article, userPreferences = {}) {
  const now = Date.now();
  const publishedTime = new Date(article.publishedAt).getTime();
  const hoursOld = Math.max((now - publishedTime) / (1000 * 60 * 60), 0);

  // 1. Freshness Score (Exponential decay over 24-48 hours)
  const freshnessScore = Math.exp(-hoursOld / 18);

  // 2. User Topic Preference Boost
  const preferredCategories = userPreferences.categories || [];
  const isPreferredCategory = preferredCategories.some(
    cat => cat.toLowerCase() === (article.category || '').toLowerCase()
  );
  const preferenceBoost = isPreferredCategory ? 1.45 : 1.0;

  // 3. Country Preference Boost
  const preferredCountries = userPreferences.countries || ['US'];
  const isPreferredCountry = preferredCountries.includes(article.country);
  const countryBoost = isPreferredCountry ? 1.15 : 1.0;

  // 4. Multi-Source Significance Boost
  let clusterBoost = 1.0;
  if (article.storyClusterId && typeof article.storyClusterId === 'object' && article.storyClusterId.sourceCount) {
    clusterBoost += Math.min((article.storyClusterId.sourceCount - 1) * 0.2, 0.8);
  }

  // Final composite score
  const totalScore = (freshnessScore * 0.45 + 0.55) * preferenceBoost * countryBoost * clusterBoost;

  return totalScore;
}

/**
 * Rank and apply Source Diversity interleaving
 * Ensures no single publisher dominates top slots (max 2 consecutive articles from same source)
 */
function rankAndDiversify(articles, userPreferences = {}) {
  if (!Array.isArray(articles) || articles.length === 0) return [];

  // Compute scores
  const scored = articles.map(article => ({
    article,
    score: calculateArticleScore(article, userPreferences)
  }));

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  // Source diversity interleaving
  const diversified = [];
  const remaining = scored.map(item => item.article);
  const sourceCountWindow = {};

  while (remaining.length > 0) {
    let candidateIndex = -1;

    for (let i = 0; i < remaining.length; i++) {
      const candidate = remaining[i];
      const source = candidate.sourceName;
      const recentSources = diversified.slice(-2).map(a => a.sourceName);

      // Avoid same source appearing 2 times in a row in the top 10 items
      const isTooFrequent = diversified.length < 15 && recentSources.filter(s => s === source).length >= 2;

      if (!isTooFrequent || i === remaining.length - 1) {
        candidateIndex = i;
        break;
      }
    }

    if (candidateIndex === -1) candidateIndex = 0;

    const [selected] = remaining.splice(candidateIndex, 1);
    diversified.push(selected);
  }

  return diversified;
}

module.exports = {
  calculateArticleScore,
  rankAndDiversify
};
