/**
 * News Feed and Discovery Controller (Zero-Dependency Standalone Mode)
 */

const HttpError = require('../models/errorModel');
const { NEWS_SOURCES, CATEGORIES } = require('../config/newsSources');
const { rankAndDiversify } = require('../services/rankingService');
const { runIngestion, getIngestionStatus } = require('../services/newsIngestionService');
const {
  findArticles,
  countArticles,
  findArticleById,
  findClusters
} = require('../services/storageService');

// GET /api/news (Personalized or General Feed)
const getFeed = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 18;
    const category = req.query.category;
    const preferences = req.user ? req.user.preferences : {};

    const query = {};
    if (category && category !== 'All') {
      query.category = category;
    }

    const candidateArticles = await findArticles(query, {
      sort: { publishedAt: -1 },
      limit: 500,
      skip: 0
    });

    const rankedArticles = rankAndDiversify(candidateArticles, preferences);
    const startIndex = (page - 1) * limit;
    const paginated = rankedArticles.slice(startIndex, startIndex + limit);
    const totalArticles = await countArticles(query);

    res.status(200).json({
      articles: paginated,
      page,
      limit,
      totalPages: Math.ceil(totalArticles / limit) || 1,
      totalArticles,
      hasMore: startIndex + limit < totalArticles
    });
  } catch (error) {
    return next(new HttpError('Failed to fetch news feed: ' + error.message, 500));
  }
};

// GET /api/news/hero (Hero Lead Story + Stacked Secondary Stories)
const getHero = async (req, res, next) => {
  try {
    const preferences = req.user ? req.user.preferences : {};

    const recent = await findArticles({}, {
      sort: { publishedAt: -1 },
      limit: 30,
      skip: 0
    });

    const ranked = rankAndDiversify(recent, preferences);
    const leadStory = ranked[0] || null;
    const secondaryStories = ranked.slice(1, 4);

    res.status(200).json({
      leadStory,
      secondaryStories
    });
  } catch (error) {
    return next(new HttpError('Failed to load hero news: ' + error.message, 500));
  }
};

// GET /api/news/trending (Trending stories 01-05 based on cluster size and freshness)
const getTrending = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 5;
    const recentClusters = await findClusters({}, { limit });

    const trending = recentClusters
      .filter(c => c.leadArticleId || c.canonicalTitle)
      .map((c, index) => ({
        rank: String(index + 1).padStart(2, '0'),
        clusterId: c._id,
        title: c.canonicalTitle || (c.leadArticleId ? c.leadArticleId.title : ''),
        category: c.category || 'Technology',
        sourceCount: c.sourceCount || (c.sources ? c.sources.length : 1),
        sources: c.sources || [],
        publishedAt: c.lastPublishedAt || new Date(),
        article: c.leadArticleId || null
      }));

    if (trending.length < limit) {
      const moreArticles = await findArticles({}, {
        sort: { publishedAt: -1 },
        limit: limit * 2,
        skip: 0
      });

      const existingIds = new Set(trending.map(t => t.article?._id?.toString()).filter(Boolean));
      for (const a of moreArticles) {
        if (trending.length >= limit) break;
        if (!existingIds.has(a._id?.toString())) {
          trending.push({
            rank: String(trending.length + 1).padStart(2, '0'),
            clusterId: a.storyClusterId || null,
            title: a.title,
            category: a.category,
            sourceCount: 1,
            sources: [a.sourceName],
            publishedAt: a.publishedAt,
            article: a
          });
        }
      }
    }

    res.status(200).json({ trending });
  } catch (error) {
    return next(new HttpError('Failed to load trending news: ' + error.message, 500));
  }
};

// GET /api/news/latest (Chronological Feed)
const getLatest = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const skip = (page - 1) * limit;

    const [articles, total] = await Promise.all([
      findArticles({}, { sort: { publishedAt: -1 }, skip, limit }),
      countArticles({})
    ]);

    res.status(200).json({
      articles,
      page,
      totalPages: Math.ceil(total / limit) || 1,
      total,
      hasMore: skip + articles.length < total
    });
  } catch (error) {
    return next(new HttpError('Failed to load latest feed: ' + error.message, 500));
  }
};

// GET /api/news/category/:category
const getCategoryFeed = async (req, res, next) => {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 15;
    const skip = (page - 1) * limit;

    const query = { category: new RegExp(`^${category}$`, 'i') };

    const [articles, total] = await Promise.all([
      findArticles(query, { sort: { publishedAt: -1 }, skip, limit }),
      countArticles(query)
    ]);

    res.status(200).json({
      category,
      articles,
      page,
      totalPages: Math.ceil(total / limit) || 1,
      total,
      hasMore: skip + articles.length < total
    });
  } catch (error) {
    return next(new HttpError('Failed to load category feed: ' + error.message, 500));
  }
};

// GET /api/news/:id (Story Overview)
const getStoryDetail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const article = await findArticleById(id);

    if (!article) {
      return next(new HttpError('Story not found.', 404));
    }

    const related = await findArticles({
      category: article.category
    }, { sort: { publishedAt: -1 }, limit: 4 });

    res.status(200).json({
      article,
      related: related.filter(r => r._id?.toString() !== article._id?.toString())
    });
  } catch (error) {
    return next(new HttpError('Failed to retrieve story: ' + error.message, 500));
  }
};

// GET /api/news/:id/coverage (Multi-Source Perspective Comparison)
const getStoryCoverage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const article = await findArticleById(id);

    if (!article) {
      return next(new HttpError('Story not found.', 404));
    }

    let coverageArticles = [article];
    const related = await findArticles({ category: article.category }, { limit: 4 });
    const additional = related.filter(r => r._id?.toString() !== article._id?.toString());
    coverageArticles = [article, ...additional];

    res.status(200).json({
      primaryArticle: article,
      coverage: coverageArticles,
      totalSources: coverageArticles.length
    });
  } catch (error) {
    return next(new HttpError('Failed to retrieve story coverage: ' + error.message, 500));
  }
};

// GET /api/news/search (Search news by keyword, topic, source, category, date)
const searchNews = async (req, res, next) => {
  try {
    const { q, category, source, dateRange, sort } = req.query;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 15;
    const skip = (page - 1) * limit;

    const query = {};

    if (q && q.trim()) {
      const regex = new RegExp(q.trim(), 'i');
      query.$or = [
        { title: regex },
        { description: regex },
        { sourceName: regex },
        { category: regex }
      ];
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (source && source !== 'All') {
      query.sourceName = new RegExp(source, 'i');
    }

    if (dateRange) {
      const now = new Date();
      if (dateRange === '24h') {
        query.publishedAt = { $gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) };
      } else if (dateRange === '7d') {
        query.publishedAt = { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) };
      } else if (dateRange === '30d') {
        query.publishedAt = { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) };
      }
    }

    const sortOption = sort === 'oldest' ? { publishedAt: 1 } : { publishedAt: -1 };

    const [articles, total] = await Promise.all([
      findArticles(query, { sort: sortOption, skip, limit }),
      countArticles(query)
    ]);

    res.status(200).json({
      query: q || '',
      category: category || 'All',
      articles,
      page,
      totalPages: Math.ceil(total / limit) || 1,
      total,
      hasMore: skip + articles.length < total
    });
  } catch (error) {
    return next(new HttpError('Search failed: ' + error.message, 500));
  }
};

// GET /api/news/sources (Sources Directory & Attribution List)
const getSources = async (req, res) => {
  const status = getIngestionStatus();
  res.status(200).json({
    categories: CATEGORIES,
    sources: NEWS_SOURCES.map(s => ({
      id: s.id,
      name: s.name,
      domain: s.domain,
      category: s.category,
      country: s.country,
      language: s.language,
      enabled: s.enabled
    })),
    status
  });
};

// POST /api/news/refresh (Operator Ingestion Trigger)
const triggerRefresh = async (req, res, next) => {
  try {
    const result = await runIngestion();
    res.status(200).json({ message: 'Ingestion completed successfully.', result });
  } catch (error) {
    return next(new HttpError('Ingestion failed: ' + error.message, 500));
  }
};

module.exports = {
  getFeed,
  getHero,
  getTrending,
  getLatest,
  getCategoryFeed,
  getStoryDetail,
  getStoryCoverage,
  searchNews,
  getSources,
  triggerRefresh
};
