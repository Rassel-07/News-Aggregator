/**
 * News Ingestion Orchestrator — Batched Concurrent Ingestion
 *
 * Fetches 81+ RSS feeds in controlled batches of 10 at a time to avoid
 * network saturation that causes timeouts when all fire simultaneously.
 */

const { NEWS_SOURCES } = require('../config/newsSources');
const { fetchSourceArticles } = require('./rssProvider');
const { fetchHackerNewsArticles } = require('./hackerNewsProvider');
const { fetchNewsDataIO, fetchNewsAPIOrg } = require('./externalApiProvider');
const { getMockArticles } = require('./mockProvider');
const { saveArticle, countArticles } = require('./storageService');

const BATCH_SIZE = 10; // fetch 10 feeds concurrently at a time

let ingestionState = {
  isRunning: false,
  lastRunAt: null,
  totalFetched: 0,
  totalSaved: 0,
  failedSources: [],
  sourceStatus: {}
};

/**
 * Process feeds in batches to avoid network saturation
 */
async function ingestInBatches(sources) {
  let totalSaved = 0;
  for (let i = 0; i < sources.length; i += BATCH_SIZE) {
    const batch = sources.slice(i, i + BATCH_SIZE);
    const results = await Promise.allSettled(
      batch.map(async (source) => {
        try {
          const articles = await fetchSourceArticles(source);
          let count = 0;
          for (const candidate of articles) {
            const saved = await saveArticle(candidate);
            if (saved) count++;
          }
          ingestionState.sourceStatus[source.id] = {
            name: source.name,
            lastSuccessAt: new Date(),
            articlesFetched: articles.length,
            newSaved: count,
            status: 'healthy'
          };
          return count;
        } catch (err) {
          ingestionState.sourceStatus[source.id] = {
            name: source.name,
            lastFailedAt: new Date(),
            error: err.message,
            status: 'error'
          };
          return 0;
        }
      })
    );
    for (const r of results) {
      if (r.status === 'fulfilled') totalSaved += r.value;
    }
  }
  return totalSaved;
}

/**
 * Run a full ingestion cycle using batched concurrency
 */
async function runIngestion(options = {}) {
  if (ingestionState.isRunning) {
    return ingestionState;
  }

  ingestionState.isRunning = true;
  console.log(`[NewsIngestion] Starting batched news ingestion at ${new Date().toISOString()} (${BATCH_SIZE} feeds/batch)...`);

  let newArticlesSaved = 0;
  const enabledSources = NEWS_SOURCES.filter(s => s.enabled);

  // 1. Ingest all RSS feeds in controlled batches of 10
  newArticlesSaved += await ingestInBatches(enabledSources);

  // 2. Hacker News API (runs alongside)
  try {
    const hnArticles = await fetchHackerNewsArticles(20);
    for (const item of hnArticles) {
      if (await saveArticle(item)) newArticlesSaved++;
    }
  } catch (e) {
    // silent
  }

  // 3. Optional External APIs (if keys provided)
  if (process.env.NEWSDATA_API_KEY) {
    try {
      const articles = await fetchNewsDataIO(process.env.NEWSDATA_API_KEY, 'technology');
      for (const a of articles) {
        if (await saveArticle(a)) newArticlesSaved++;
      }
    } catch (e) { /* silent */ }
  }

  if (process.env.NEWS_API_KEY) {
    try {
      const articles = await fetchNewsAPIOrg(process.env.NEWS_API_KEY, 'technology');
      for (const a of articles) {
        if (await saveArticle(a)) newArticlesSaved++;
      }
    } catch (e) { /* silent */ }
  }

  // 4. Seed mock articles only if store is completely empty
  const totalCount = await countArticles();
  if (totalCount === 0) {
    console.log('[NewsIngestion] Store empty — seeding fallback articles...');
    const mock = getMockArticles();
    for (const item of mock) {
      await saveArticle(item);
      newArticlesSaved++;
    }
  }

  ingestionState.isRunning = false;
  ingestionState.lastRunAt = new Date();
  ingestionState.totalSaved += newArticlesSaved;

  const finalCount = await countArticles();
  const healthy = Object.values(ingestionState.sourceStatus).filter(s => s.status === 'healthy').length;
  const failed = Object.values(ingestionState.sourceStatus).filter(s => s.status === 'error').length;
  console.log(`[NewsIngestion] Done. Saved ${newArticlesSaved} new items. Total: ${finalCount}. Sources: ${healthy} OK / ${failed} failed.`);

  return ingestionState;
}

function getIngestionStatus() {
  return {
    ...ingestionState,
    totalSources: NEWS_SOURCES.length,
    enabledSources: NEWS_SOURCES.filter(s => s.enabled).length
  };
}

// isMongoConnected kept for backward compat
function isMongoConnected() { return false; }

module.exports = {
  runIngestion,
  getIngestionStatus,
  isMongoConnected
};
