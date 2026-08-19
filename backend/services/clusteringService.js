/**
 * Story Clustering and Deduplication Service
 * 
 * Groups articles discussing the same event into StoryClusters
 * so readers can compare multiple perspectives and avoid repetitive feeds.
 */

const StoryCluster = require('../models/storyClusterModel');
const Article = require('../models/articleModel');
const { extractTokens, computeSimilarity } = require('./normalizer');

const SIMILARITY_THRESHOLD = 0.45; // Token overlap threshold for clustering
const TIME_WINDOW_HOURS = 48; // Max time difference between articles in the same cluster

/**
 * Cluster a newly ingested article into an existing cluster or create a new cluster
 */
async function clusterArticle(article) {
  try {
    const publishedTime = new Date(article.publishedAt).getTime();
    const windowStart = new Date(publishedTime - TIME_WINDOW_HOURS * 60 * 60 * 1000);
    const windowEnd = new Date(publishedTime + TIME_WINDOW_HOURS * 60 * 60 * 1000);

    // Find existing clusters in the same category or recent active clusters
    const candidateClusters = await StoryCluster.find({
      category: article.category,
      lastPublishedAt: { $gte: windowStart, $lte: windowEnd }
    }).populate('articles', 'title normalizedTitle sourceName publishedAt');

    const articleTokens = extractTokens(article.title);
    let matchedCluster = null;
    let highestScore = 0;

    for (const cluster of candidateClusters) {
      // Compare with cluster canonical title
      const clusterTokens = extractTokens(cluster.canonicalTitle);
      const titleScore = computeSimilarity(articleTokens, clusterTokens);

      if (titleScore > highestScore && titleScore >= SIMILARITY_THRESHOLD) {
        highestScore = titleScore;
        matchedCluster = cluster;
      }

      // Also check articles inside cluster
      if (!matchedCluster && cluster.articles && cluster.articles.length > 0) {
        for (const clusterArticle of cluster.articles) {
          const itemTokens = extractTokens(clusterArticle.title);
          const score = computeSimilarity(articleTokens, itemTokens);
          if (score > highestScore && score >= SIMILARITY_THRESHOLD) {
            highestScore = score;
            matchedCluster = cluster;
            break;
          }
        }
      }
    }

    if (matchedCluster) {
      // Add article to existing cluster if not already present
      const alreadyInCluster = matchedCluster.articles.some(
        a => (a._id ? a._id.toString() : a.toString()) === article._id.toString()
      );

      if (!alreadyInCluster) {
        matchedCluster.articles.push(article._id);
        if (!matchedCluster.sources.includes(article.sourceName)) {
          matchedCluster.sources.push(article.sourceName);
        }
        matchedCluster.sourceCount = matchedCluster.sources.length;
        if (new Date(article.publishedAt) > matchedCluster.lastPublishedAt) {
          matchedCluster.lastPublishedAt = new Date(article.publishedAt);
        }
        await matchedCluster.save();
      }

      // Link cluster to article
      article.storyClusterId = matchedCluster._id;
      await Article.findByIdAndUpdate(article._id, { storyClusterId: matchedCluster._id });
      return matchedCluster;
    } else {
      // Create new cluster
      const newCluster = await StoryCluster.create({
        canonicalTitle: article.title,
        summary: article.description,
        category: article.category,
        keywords: articleTokens.slice(0, 8),
        leadArticleId: article._id,
        articles: [article._id],
        sourceCount: 1,
        sources: [article.sourceName],
        firstPublishedAt: article.publishedAt,
        lastPublishedAt: article.publishedAt
      });

      article.storyClusterId = newCluster._id;
      await Article.findByIdAndUpdate(article._id, { storyClusterId: newCluster._id });
      return newCluster;
    }
  } catch (error) {
    console.error('[ClusteringService] Error clustering article:', error.message);
    return null;
  }
}

/**
 * Batch cluster multiple articles
 */
async function clusterArticles(articles) {
  const results = [];
  for (const article of articles) {
    const cluster = await clusterArticle(article);
    if (cluster) results.push(cluster);
  }
  return results;
}

module.exports = {
  clusterArticle,
  clusterArticles,
  SIMILARITY_THRESHOLD
};
